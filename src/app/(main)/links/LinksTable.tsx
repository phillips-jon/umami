import { Column, DataColumn, DataTable, type DataTableProps, Icon, Row, Text } from '@umami/react-zen';
import { useState } from 'react';
import { DateDistance } from '@/components/common/DateDistance';
import { ExternalLink } from '@/components/common/ExternalLink';
import Link from '@/components/common/Link';
import { SortableLabel } from '@/components/common/SortableLabel';
import { useMessages, useNavigation, useSlug } from '@/components/hooks';
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

export function LinksTable({ showActions, ...props }: LinksTableProps) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('link');

  return (
    <DataTable {...props}>
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
        width="25%"
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
        width="30%"
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
        id="created"
        label={
          <SortableLabel label={t(labels.created)} sortKey="createdAt" defaultDirection="desc" />
        }
        width="200px"
      >
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      {showActions && (
        <DataColumn id="action" align="end" width="100px">
          {({ id, name }: any) => {
            return (
              <Row>
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
