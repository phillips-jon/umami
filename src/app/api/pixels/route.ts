import { z } from 'zod';
import { uuid } from '@/lib/crypto';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { badRequest, json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams } from '@/lib/schema';
import { canCreateTeamWebsite, canCreateWebsite } from '@/permissions';
import { createPixel, getUserPixels, getVerifiedCustomDomainsForUser } from '@/queries/prisma';

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

  const links = await getUserPixels(auth.user.id, filters);

  return json(links);
}

export async function POST(request: Request) {
  const schema = z.object({
    name: z.string().max(100),
    slug: z.string().max(100),
    teamId: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
    customDomainId: z.uuid().nullable().optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { id, name, slug, teamId, customDomainId } = body;

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
    slug,
    teamId,
    customDomainId: customDomainId ?? null,
  };

  if (!teamId) {
    data.userId = auth.user.id;
  }

  const result = await createPixel(data);

  return json(result);
}
