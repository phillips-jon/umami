import type { ReactQueryOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useModified } from '../useModified';
import { usePagedQuery } from '../usePagedQuery';

export function useLinksQuery(
  {
    teamId,
    pageSize,
    customDomainId,
  }: { teamId?: string; pageSize?: number; customDomainId?: string },
  options?: ReactQueryOptions,
) {
  const { modified } = useModified('links');
  const { get } = useApi();

  return usePagedQuery({
    queryKey: ['links', { teamId, customDomainId, modified }],
    queryFn: pageParams => {
      return get(teamId ? `/teams/${teamId}/links` : '/links', {
        ...pageParams,
        pageSize: pageSize || pageParams?.pageSize,
        customDomainId: customDomainId || undefined,
      });
    },
    ...options,
  });
}
