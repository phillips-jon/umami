import { z } from 'zod';
import { uuid } from '@/lib/crypto';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams } from '@/lib/schema';
import { canCreateTeamWebsite, canCreateWebsite } from '@/permissions';
import { createLink, getUserLinks, getVerifiedCustomDomainsForUser } from '@/queries/prisma';

export async function GET(request: Request) {
  const schema = z.object({
    ...pagingParams,
    ...searchParams,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const filters = await getQueryFilters(query);

  const links = await getUserLinks(auth.user.id, filters);

  return json(links);
}

export async function POST(request: Request) {
  const schema = z.object({
    name: z.string().max(100),
    url: z
      .string()
      .url()
      .max(500)
      .refine(u => /^https?:\/\//i.test(u), {
        message: 'Only http and https URLs are allowed',
      }),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-zA-Z0-9_-]+$/),
    teamId: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
    customDomainId: z.uuid().nullable().optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { id, name, url, slug, teamId, customDomainId } = body;

  if (teamId) {
    if (!(await canCreateTeamWebsite(auth, teamId))) return unauthorized();
  } else {
    if (!(await canCreateWebsite(auth))) return unauthorized();
  }

  if (customDomainId) {
    const allowed = await getVerifiedCustomDomainsForUser(auth.user.id);
    if (!allowed.some(d => d.id === customDomainId)) {
      return badRequest({ message: 'Invalid custom domain.' });
    }
  }

  const data: any = {
    id: id ?? uuid(),
    name,
    url,
    slug,
    teamId,
    customDomainId: customDomainId ?? null,
  };

  if (!teamId) {
    data.userId = auth.user.id;
  }

  const result = await createLink(data);

  return json(result);
}
