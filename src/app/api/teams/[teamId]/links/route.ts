import { z } from 'zod';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { pagingParams, searchParams } from '@/lib/schema';
import { canViewTeam } from '@/permissions';
import { getTeamLinks } from '@/queries/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  const schema = z.object({
    ...pagingParams,
    ...searchParams,
    customDomainId: z.string().optional(),
  });
  const { teamId } = await params;
  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  if (!(await canViewTeam(auth, teamId))) {
    return unauthorized();
  }

  const { customDomainId, ...queryParams } = query;
  const filters = await getQueryFilters(queryParams);

  const links = await getTeamLinks(teamId, filters, customDomainId);

  return json(links);
}
