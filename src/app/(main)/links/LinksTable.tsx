import { Column, DataColumn, DataTable, type DataTableProps, Icon, Row, Text } from '@umami/react-zen';
import { useMemo, useState } from 'react';
import { WebsiteSparkline } from '@/app/(main)/websites/WebsiteSparkline';
import { DateDistance } from '@/components/common/DateDistance';
import { ExternalLink } from '@/components/common/ExternalLink';
import Link from '@/components/common/Link';
import { SortableLabel } from '@/components/common/SortableLabel';
import { useLinkListChartsQuery, useMessages, useNavigation, useSlug } from '@/components/hooks';
import { BarChart2, Check, Copy } from '@/components/icons';
import { LinkDeleteButton } from './LinkDeleteButton';
import { LinkEditButton } from './LinkEditButton';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Icon
      size="sm"
      onClick={handleCopy}
      style={{ cursor: 'pointer', opacity: copied ? 1 : 0.5, flexShrink: 0 }}
    >
      {copied ? <Check /> : <Copy />}
    </Icon>
  );
}

export interface LinksTableProps extends DataTableProps {
  showActions?: boolean;
}

export function LinksTable({ showActions, data = [], ...props }: LinksTableProps & { data?: any[] }) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('link');
  const linkIds = useMemo(() => data.map(row => row.id), [data]);
  const chartsQuery = useLinkListChartsQuery(linkIds);
  const charts = chartsQuery.data?.data || {};
  const isChartLoading = chartsQuery.isLoading && !chartsQuery.data;

  return (
    <DataTable {...props} data={data}>
      <DataColumn id="name" label={<SortableLabel label={t(labels.name)} sortKey="name" />}>
        {({ id, name, clicks }: any) => {
          return (
            <Column>
              <Link href={renderUrl(`/links/${id}`)}>{name}</Link>
              <Row alignItems="center" gap="1" style={{ marginTop: '4px' }}>
                <Icon size="xs" strokeColor="muted">
                  <BarChart2 />
                </Icon>
                <Text color="muted" style={{ fontSize: '11px' }}>
                  {(clicks ?? 0).toLocaleString()} clicks
                </Text>
              </Row>
            </Column>
          );
        }}
      </DataColumn>
      <DataColumn
        id="slug"
        label={<SortableLabel label={t(labels.link)} sortKey="slug" />}
        style={{ minWidth: 0 }}
      >
        {({ slug, customDomain }: any) => {
          const url = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);
          return (
            <Row alignItems="center" gap="2" overflow="hidden" style={{ minWidth: 0 }}>
              <CopyButton text={url} />
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <ExternalLink href={url}>{url}</ExternalLink>
              </div>
            </Row>
          );
        }}
      </DataColumn>
      <DataColumn
        id="url"
        label={<SortableLabel label={t(labels.destinationUrl)} sortKey="url" />}
        style={{ minWidth: 0 }}
      >
        {({ url }: any) => {
          return (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <ExternalLink href={url}>{url}</ExternalLink>
            </div>
          );
        }}
      </DataColumn>
      <DataColumn
        id="chart"
        label={<span style={{ whiteSpace: 'normal' }}>{`${t(labels.visitors)} (7d)`}</span>}
        style={{ minWidth: 0 }}
      >
        {(row: any) => {
          const chart = charts[row.id];

          return (
            <WebsiteSparkline
              values={chart?.values}
              total={chart?.total}
              isLoading={isChartLoading}
            />
          );
        }}
      </DataColumn>
      <DataColumn
        id="created"
        label={
          <SortableLabel label={t(labels.created)} sortKey="createdAt" defaultDirection="desc" />
        }
        width="180px"
      >
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      {showActions && (
        <DataColumn id="action" align="end" width="72px">
          {({ id, name }: any) => {
            return (
              <Row gap="2">
                <LinkEditButton linkId={id} />
                <LinkDeleteButton linkId={id} websiteId={websiteId} name={name} />
              </Row>
            );
          }}
        </DataColumn>
      )}
    </DataTable>
  );
}
