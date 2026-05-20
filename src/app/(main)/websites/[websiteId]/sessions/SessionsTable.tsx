import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import { Avatar } from '@/components/common/Avatar';
import { DateDistance } from '@/components/common/DateDistance';
import Link from '@/components/common/Link';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { TypeIcon } from '@/components/common/TypeIcon';
import { useFormat, useMessages, useMobile } from '@/components/hooks';

function SessionMobileCard({
  row,
  getSessionHref,
  websiteId,
}: {
  row: any;
  getSessionHref?: (row: any) => string;
  websiteId: string;
}) {
  const { t, labels } = useMessages();
  const { formatValue } = useFormat();
  const href = getSessionHref ? getSessionHref(row) : `/websites/${websiteId}/sessions/${row.id}`;

  return (
    <MobileCard>
      <MobileCardRow>
        <Link href={href}>
          <Row alignItems="center" gap="2">
            <Avatar seed={row.id} size={32} />
            <Text size="sm" color="muted">
              {row.visits} {t(labels.visits).toLowerCase()}, {row.views}{' '}
              {t(labels.views).toLowerCase()}
            </Text>
          </Row>
        </Link>
      </MobileCardRow>
      <MobileCardField label={t(labels.country)}>
        <TypeIcon type="country" value={row.country}>
          {row.city ? `${row.city}, ` : ''}
          {formatValue(row.country, 'country')}
        </TypeIcon>
      </MobileCardField>
      <MobileCardRow>
        <TypeIcon type="browser" value={row.browser}>
          {formatValue(row.browser, 'browser')}
        </TypeIcon>
        <TypeIcon type="device" value={row.device}>
          {formatValue(row.device, 'device')}
        </TypeIcon>
      </MobileCardRow>
      <MobileCardRow>
        <Text size="sm" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        <div />
      </MobileCardRow>
    </MobileCard>
  );
}

export function SessionsTable({
  websiteId,
  getSessionHref,
  ...props
}: DataTableProps & { websiteId: string; getSessionHref?: (row: any) => string }) {
  const { t, labels } = useMessages();
  const { formatValue } = useFormat();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any, i: number) => (
          <SessionMobileCard
            key={row.id || i}
            row={row}
            getSessionHref={getSessionHref}
            websiteId={websiteId}
          />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="id" label={t(labels.session)} width="100px">
        {(row: any) => (
          <Link
            href={getSessionHref ? getSessionHref(row) : `/websites/${websiteId}/sessions/${row.id}`}
          >
            <Avatar seed={row.id} size={32} />
          </Link>
        )}
      </DataColumn>
      <DataColumn id="visits" label={t(labels.visits)} width="80px" />
      <DataColumn id="views" label={t(labels.views)} width="80px" />
      <DataColumn id="events" label={t(labels.events)} width="80px" />
      <DataColumn id="location" label={t(labels.location)}>
        {(row: any) => (
          <TypeIcon type="country" value={row.country}>
            {row.city ? `${row.city}, ` : ''}
            {formatValue(row.country, 'country')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="browser" label={t(labels.browser)} width="140px">
        {(row: any) => (
          <TypeIcon type="browser" value={row.browser}>
            {formatValue(row.browser, 'browser')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="os" label={t(labels.os)} width="140px">
        {(row: any) => (
          <TypeIcon type="os" value={row.os}>
            {formatValue(row.os, 'os')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="device" label={t(labels.device)} width="140px">
        {(row: any) => (
          <TypeIcon type="device" value={row.device}>
            {formatValue(row.device, 'device')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="lastAt" label={t(labels.lastSeen)} width="140px">
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
    </DataTable>
  );
}
