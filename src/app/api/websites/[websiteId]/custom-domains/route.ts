import { z } from 'zod';
import { DOMAIN_REGEX } from '@/lib/constants';
import { uuid } from '@/lib/crypto';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { canUpdateWebsite, canViewWebsite } from '@/permissions';
import { createCustomDomain, getCustomDomainByDomain, getCustomDomains } from '@/queries/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  if (!process.env.ENABLE_CUSTOM_DOMAINS) {
    return badRequest({ message: 'Custom domains are not enabled.' });
  }

  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const domains = await getCustomDomains(websiteId);
  const appHostname = process.env.APP_URL ? new URL(process.env.APP_URL).hostname : null;
  const cnameTarget = process.env.CUSTOM_DOMAIN_CNAME_TARGET || appHostname;

  return json({ data: domains, cnameTarget });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  if (!process.env.ENABLE_CUSTOM_DOMAINS) {
    return badRequest({ message: 'Custom domains are not enabled.' });
  }

  const schema = z.object({
    domain: z.string().max(253).regex(DOMAIN_REGEX, 'Invalid domain format.'),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;
  const { domain } = body;

  if (!(await canUpdateWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const existing = await getCustomDomainByDomain(domain);

  if (existing) {
    return badRequest({ message: 'This domain is already registered.' });
  }

  const appHostname = process.env.APP_URL ? new URL(process.env.APP_URL).hostname : null;

  if (appHostname && domain === appHostname) {
    return badRequest({ message: 'This domain cannot be used as a custom tracking domain.' });
  }

  const cnameTarget = process.env.CUSTOM_DOMAIN_CNAME_TARGET || appHostname;

  const customDomain = await createCustomDomain({ id: uuid(), websiteId, domain });

  return json({ data: { ...customDomain, cnameTarget } });
}
