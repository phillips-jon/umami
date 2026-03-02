import { verifyCname } from '@/lib/dns';
import { parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { canUpdateWebsite } from '@/permissions';
import { getCustomDomain, updateCustomDomain } from '@/queries/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; domainId: string }> },
) {
  if (!process.env.ENABLE_CUSTOM_DOMAINS) {
    return badRequest({ message: 'Custom domains are not enabled.' });
  }

  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { websiteId, domainId } = await params;

  if (!(await canUpdateWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const customDomain = await getCustomDomain(domainId);

  if (!customDomain || customDomain.websiteId !== websiteId) {
    return badRequest({ message: 'Domain not found.' });
  }

  const appHostname = process.env.APP_URL ? new URL(process.env.APP_URL).hostname : null;
  const cnameTarget = process.env.CUSTOM_DOMAIN_CNAME_TARGET || appHostname;

  if (!cnameTarget) {
    return badRequest({
      message:
        'CNAME target is not configured. Set CUSTOM_DOMAIN_CNAME_TARGET or APP_URL environment variable.',
    });
  }

  const result = await verifyCname(customDomain.domain, cnameTarget);

  if (result.verified) {
    await updateCustomDomain(domainId, { verified: true, verifiedAt: new Date() });
  }

  return json({
    verified: result.verified,
    message: result.verified ? undefined : `CNAME not found. Expected: ${cnameTarget}`,
    actual: result.actual,
  });
}
