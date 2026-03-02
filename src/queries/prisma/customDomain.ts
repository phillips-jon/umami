import type { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

export async function getCustomDomain(domainId: string) {
  return prisma.client.customDomain.findUnique({
    where: { id: domainId },
  });
}

export async function getCustomDomainByDomain(domain: string) {
  return prisma.client.customDomain.findUnique({
    where: { domain },
  });
}

export async function getCustomDomains(websiteId: string) {
  return prisma.client.customDomain.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createCustomDomain(data: Prisma.CustomDomainUncheckedCreateInput) {
  return prisma.client.customDomain.create({ data });
}

export async function updateCustomDomain(
  domainId: string,
  data: Prisma.CustomDomainUncheckedUpdateInput,
) {
  return prisma.client.customDomain.update({ where: { id: domainId }, data });
}

export async function deleteCustomDomain(domainId: string) {
  return prisma.client.customDomain.delete({ where: { id: domainId } });
}

export async function getVerifiedCustomDomainsForUser(userId: string) {
  const ownDomains = await prisma.client.customDomain.findMany({
    where: { verified: true, website: { userId } },
    include: { website: { select: { id: true, name: true } } },
    orderBy: { domain: 'asc' },
  });

  const teamMemberships = await prisma.client.teamUser.findMany({
    where: { userId },
    select: { teamId: true },
  });

  if (teamMemberships.length === 0) {
    return ownDomains;
  }

  const teamIds = teamMemberships.map(m => m.teamId);
  const teamDomains = await prisma.client.customDomain.findMany({
    where: { verified: true, website: { teamId: { in: teamIds } } },
    include: { website: { select: { id: true, name: true } } },
    orderBy: { domain: 'asc' },
  });

  return [...ownDomains, ...teamDomains];
}
