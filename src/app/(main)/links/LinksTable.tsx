import {
  Column,
  DataColumn,
  DataTable,
  type DataTableProps,
  Icon,
  Row,
  Text,
} from '@umami/react-zen';
import { useState } from 'react';
import { DateDistance } from '@/components/common/DateDistance';
import { ExternalLink } from '@/components/common/ExternalLink';
import Link from '@/components/common/Link';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation, useSlug } from '@/components/hooks';
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

function LinkMobileCard({ row, showActions }: { row: any; showActions?: boolean }) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('link');

  const { id, name, clicks, slug, customDomain, url, createdAt } = row;
  const linkUrl = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);

  return (
    <MobileCard>
      <MobileCardField label={t(labels.name)}>
        <MobileCardRow>
          <Link href={renderUrl(`/links/${id}`)}>{name}</Link>
          <Row alignItems="center" gap="1">
            <Icon size="xs" strokeColor="muted">
              <BarChart2 />
            </Icon>
            <Text color="muted" style={{ fontSize: '11px' }}>
              {(clicks ?? 0).toLocaleString()}
            </Text>
          </Row>
        </MobileCardRow>
      </MobileCardField>

      <MobileCardField label={t(labels.link)}>
        <Row alignItems="center" gap="2">
          <CopyButton text={linkUrl} />
          <Text style={{ wordBreak: 'break-all' }}>
            <ExternalLink href={linkUrl}>{linkUrl}</ExternalLink>
          </Text>
        </Row>
      </MobileCardField>

      <MobileCardField label={t(labels.destinationUrl)}>
        <Text style={{ wordBreak: 'break-all' }}>
          <ExternalLink href={url}>{url}</ExternalLink>
        </Text>
      </MobileCardField>

      <MobileCardRow>
        <Text size="sm" color="muted">
          <DateDistance date={new Date(createdAt)} />
        </Text>
        {showActions && (
          <Row>
            <LinkEditButton linkId={id} />
            <LinkDeleteButton linkId={id} websiteId={websiteId} name={name} />
          </Row>
        )}
      </MobileCardRow>
    </MobileCard>
  );
}

export interface LinksTableProps extends DataTableProps {
  showActions?: boolean;
}

export function LinksTable({ showActions, ...props }: LinksTableProps) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('link');
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <LinkMobileCard key={row.id} row={row} showActions={showActions} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={t(labels.name)} width="200px">
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
      <DataColumn id="slug" label={t(labels.link)} width="minmax(0, 1fr)">
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
      <DataColumn id="url" label={t(labels.destinationUrl)} width="minmax(0, 1fr)">
        {({ url }: any) => {
          return (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <ExternalLink href={url}>{url}</ExternalLink>
            </div>
          );
        }}
      </DataColumn>
      <DataColumn id="created" label={t(labels.created)} width="140px">
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
