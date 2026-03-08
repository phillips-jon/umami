import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import { DateDistance } from '@/components/common/DateDistance';
import { ExternalLink } from '@/components/common/ExternalLink';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation, useSlug } from '@/components/hooks';
import { PixelDeleteButton } from './PixelDeleteButton';
import { PixelEditButton } from './PixelEditButton';

function PixelMobileCard({ row }: { row: any }) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('pixel');

  const { id, name, slug, customDomain, createdAt } = row;
  const url = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        <Link href={renderUrl(`/pixels/${id}`)}>{name}</Link>
      </MobileCardField>
      <MobileCardField label="URL">
        <Text style={{ wordBreak: 'break-all' }}>
          <ExternalLink href={url} prefetch={false}>
            {url}
          </ExternalLink>
        </Text>
      </MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          <DateDistance date={new Date(createdAt)} />
        </Text>
        <Row>
          <PixelEditButton pixelId={id} />
          <PixelDeleteButton pixelId={id} name={name} />
        </Row>
      </MobileCardRow>
    </MobileCard>
  );
}

export function PixelsTable({ displayMode, ...props }: DataTableProps & { displayMode?: string }) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('pixel');
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <PixelMobileCard key={row.id} row={row} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {({ id, name }: any) => {
          return <Link href={renderUrl(`/pixels/${id}`)}>{name}</Link>;
        }}
      </DataColumn>
      <DataColumn id="url" label="URL">
        {({ slug, customDomain }: any) => {
          const url = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);
          return (
            <ExternalLink href={url} prefetch={false}>
              {url}
            </ExternalLink>
          );
        }}
      </DataColumn>
      <DataColumn id="created" label={formatMessage(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      <DataColumn id="action" align="end" width="100px">
        {(row: any) => {
          const { id, name } = row;

          return (
            <Row>
              <PixelEditButton pixelId={id} />
              <PixelDeleteButton pixelId={id} name={name} />
            </Row>
          );
        }}
      </DataColumn>
    </DataTable>
  );
}
