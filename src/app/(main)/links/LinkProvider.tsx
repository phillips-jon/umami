'use client';
import { Loading } from '@umami/react-zen';
import { createContext, type ReactNode } from 'react';
import { useLinkQuery } from '@/components/hooks/queries/useLinkQuery';
import type { Link } from '@/generated/prisma/client';

type LinkWithRelations = Link & { customDomain?: { id: string; domain: string } | null };

export const LinkContext = createContext<LinkWithRelations>(null);

export function LinkProvider({ linkId, children }: { linkId?: string; children: ReactNode }) {
  const { data: link, isLoading, isFetching } = useLinkQuery(linkId);

  if (isFetching && isLoading) {
    return <Loading placement="absolute" />;
  }

  if (!link) {
    return null;
  }

  return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>;
}
