import type { ReactQueryOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useModified } from '../useModified';
import { usePagedQuery } from '../usePagedQuery';

export function useLinksQuery(
  options1?: { teamId?: string; pageSize?: number; customDomainId?: string },
  params?: Record<string, any>,
  options?: ReactQueryOptions,
) {
  const { teamId, pageSize, customDomainId } = options1 ?? {};
  const { modified } = useModified('links');
  const { get } = useApi();

  return usePagedQuery({
    queryKey: ['links', { teamId, customDomainId, modified, ...params }],
    queryFn: (pageParams: any) => {
      return get(teamId ? `/teams/${teamId}/links` : '/links', {
        ...pageParams,
        ...params,
        pageSize: pageSize || pageParams?.pageSize,
        customDomainId: customDomainId || undefined,
      });
    },
    ...options,
  });
}
