import { ListItem, Select } from '@umami/react-zen';
import { useState } from 'react';
import { DataGrid } from '@/components/common/DataGrid';
import { useLinksQuery, useNavigation, useUserCustomDomainsQuery } from '@/components/hooks';
import { LinksTable } from './LinksTable';

const PAGE_SIZE_OPTIONS = [50, 100, 250, 500, 0];

export function LinksDataTable() {
  const { teamId, query } = useNavigation();
  const pageSize = query?.pageSize != null ? Number(query.pageSize) : 50;
  const [customDomainId, setCustomDomainId] = useState('');
  const { data: domainsData } = useUserCustomDomainsQuery();
  const domains: { id: string; domain: string }[] = domainsData?.data ?? [];

  const linksQuery = useLinksQuery({
    teamId,
    pageSize: pageSize === 0 ? 10000 : pageSize,
    customDomainId: customDomainId || undefined,
  });

  const renderActions = () => {
    if (domains.length < 2) return null;

    const items = [{ id: '', domain: 'All domains' }, ...domains];

    return (
      <Select
        value={customDomainId}
        onChange={(value: string) => setCustomDomainId(value)}
        items={items}
        buttonProps={{ style: { minHeight: '40px', minWidth: '160px' } }}
      >
        {({ id, domain }: any) => <ListItem key={id}>{domain}</ListItem>}
      </Select>
    );
  };

  return (
    <DataGrid
      query={linksQuery}
      allowSearch={true}
      autoFocus={false}
      allowPaging={true}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      renderActions={renderActions}
    >
      {({ data }) => <LinksTable data={data} />}
    </DataGrid>
  );
}
