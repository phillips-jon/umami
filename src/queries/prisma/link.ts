import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import type { QueryFilters } from '@/lib/types';

export async function findLink(criteria: Prisma.LinkFindUniqueArgs) {
  return prisma.client.link.findUnique(criteria);
}

export async function getLink(linkId: string) {
  return prisma.client.link.findUnique({
    where: {
      id: linkId,
    },
    include: {
      customDomain: true,
    },
  });
}

export async function getLinks(criteria: Prisma.LinkFindManyArgs, filters: QueryFilters = {}) {
  const { search } = filters;
  const { getSearchParameters, pagedQuery } = prisma;

  const where: Prisma.LinkWhereInput = {
    ...criteria.where,
    ...getSearchParameters(search, [
      { name: 'contains' },
      { url: 'contains' },
      { slug: 'contains' },
    ]),
  };

  return pagedQuery('link', { ...criteria, where }, filters);
}

async function appendClickCounts(result: any) {
  if (!result?.data?.length) return result;

  const linkIds: string[] = result.data.map((link: any) => link.id);
  const placeholders = linkIds.map((_, i) => `$${i + 1}::uuid`).join(',');
  const counts: any[] = await prisma.client.$queryRawUnsafe(
    `select website_id as "linkId", count(*)::int as "clicks"
     from website_event
     where website_id in (${placeholders})
     group by website_id`,
    ...linkIds,
  );

  const countMap = new Map(counts.map((c: any) => [c.linkId, c.clicks]));
  result.data = result.data.map((link: any) => ({
    ...link,
    clicks: countMap.get(link.id) || 0,
  }));

  return result;
}

export async function getUserLinks(
  userId: string,
  filters?: QueryFilters,
  customDomainId?: string,
) {
  const where: Prisma.LinkWhereInput = {
    userId,
    deletedAt: null,
  };

  if (customDomainId) {
    where.customDomainId = customDomainId;
  }

  const result = await getLinks(
    {
      where,
      include: {
        customDomain: true,
      },
    },
    filters,
  );

  return appendClickCounts(result);
}

export async function getTeamLinks(
  teamId: string,
  filters?: QueryFilters,
  customDomainId?: string,
) {
  const where: Prisma.LinkWhereInput = {
    teamId,
  };

  if (customDomainId) {
    where.customDomainId = customDomainId;
  }

  const result = await getLinks(
    {
      where,
      include: {
        customDomain: true,
      },
    },
    filters,
  );

  return appendClickCounts(result);
}

export async function createLink(data: Prisma.LinkUncheckedCreateInput) {
  return prisma.client.link.create({ data });
}

export async function updateLink(linkId: string, data: any) {
  return prisma.client.link.update({ where: { id: linkId }, data });
}

export async function deleteLink(linkId: string) {
  return prisma.client.link.delete({ where: { id: linkId } });
}
