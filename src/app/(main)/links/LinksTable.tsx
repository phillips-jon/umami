import {
  Column,
  DataColumn,
  DataTable,
  type DataTableProps,
  Icon,
  Row,
  Text,
} from '@umami/react-zen';
import Link from 'next/link';
import { useState } from 'react';
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

export function LinksTable(props: DataTableProps) {
  const { formatMessage, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('link');

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)} width="200px">
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
      <DataColumn id="slug" label={formatMessage(labels.link)}>
        {({ slug, customDomain }: any) => {
          const url = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);
          return (
            <Row alignItems="center" gap="2" overflow="hidden">
              <CopyButton text={url} />
              <Text truncate title={url}>
                <Link href={url} target="_blank" prefetch={false}>
                  {url}
                </Link>
              </Text>
            </Row>
          );
        }}
      </DataColumn>
      <DataColumn id="url" label={formatMessage(labels.destinationUrl)}>
        {({ url }: any) => {
          return (
            <Text truncate title={url}>
              <Link href={url} target="_blank" prefetch={false}>
                {url}
              </Link>
            </Text>
          );
        }}
      </DataColumn>
      <DataColumn id="created" label={formatMessage(labels.created)} width="110px">
        {(row: any) => new Date(row.createdAt).toLocaleDateString()}
      </DataColumn>
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
    </DataTable>
  );
}
