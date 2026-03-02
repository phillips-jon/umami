import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useUserCustomDomainsQuery() {
  const { get, useQuery } = useApi();
  const { modified } = useModified('custom-domains');

  return useQuery({
    queryKey: ['user-custom-domains', { modified }],
    queryFn: () => get('/me/custom-domains'),
  });
}
