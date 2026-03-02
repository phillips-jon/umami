import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useCustomDomainsQuery(websiteId: string) {
  const { get, useQuery } = useApi();
  const { modified } = useModified('custom-domains');

  return useQuery({
    queryKey: ['custom-domains', { websiteId, modified }],
    queryFn: () => get(`/websites/${websiteId}/custom-domains`),
    enabled: !!websiteId,
  });
}
