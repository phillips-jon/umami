import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import { DateDistance } from '@/components/common/DateDistance';
import { ExternalLink } from '@/components/common/ExternalLink';
import Link from '@/components/common/Link';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation, useSlug } from '@/components/hooks';
import { PixelDeleteButton } from './PixelDeleteButton';
import { PixelEditButton } from './PixelEditButton';

function PixelMobileCard({ row, showActions }: { row: any; showActions?: boolean }) {
  const { t, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('pixel');

  const { id, name, slug, customDomain, createdAt } = row;
  const url = customDomain ? `https://${customDomain.domain}/${slug}` : getSlugUrl(slug);

  return (
    <MobileCard>
      <MobileCardField label={t(labels.name)}>
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
        <Text size="sm" color="muted">
          <DateDistance date={new Date(createdAt)} />
        </Text>
        {showActions && (
          <Row>
            <PixelEditButton pixelId={id} />
            <PixelDeleteButton pixelId={id} name={name} />
          </Row>
        )}
      </MobileCardRow>
    </MobileCard>
  );
}

export interface PixelsTableProps extends DataTableProps {
  showActions?: boolean;
}

export function PixelsTable({ showActions, ...props }: PixelsTableProps) {
  const { t, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const { getSlugUrl } = useSlug('pixel');
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <PixelMobileCard key={row.id} row={row} showActions={showActions} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={t(labels.name)}>
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
      <DataColumn id="created" label={t(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      {showActions && (
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
      )}
    </DataTable>
  );
}
