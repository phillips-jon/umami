import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import { Avatar } from '@/components/common/Avatar';
import { DateDistance } from '@/components/common/DateDistance';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { TypeIcon } from '@/components/common/TypeIcon';
import { useFormat, useMessages, useMobile, useNavigation } from '@/components/hooks';

function SessionMobileCard({ row }: { row: any }) {
  const { formatMessage, labels } = useMessages();
  const { formatValue } = useFormat();
  const { updateParams } = useNavigation();

  return (
    <MobileCard>
      <MobileCardRow>
        <Link href={updateParams({ session: row.id })}>
          <Row alignItems="center" gap="2">
            <Avatar seed={row.id} size={32} />
            <Text size="2" color="muted">
              {row.visits} {formatMessage(labels.visits).toLowerCase()}, {row.views}{' '}
              {formatMessage(labels.views).toLowerCase()}
            </Text>
          </Row>
        </Link>
      </MobileCardRow>
      <MobileCardField label={formatMessage(labels.country)}>
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
        <Text size="2" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        <div />
      </MobileCardRow>
    </MobileCard>
  );
}

export function SessionsTable({
  displayMode,
  ...props
}: DataTableProps & { displayMode?: string }) {
  const { formatMessage, labels } = useMessages();
  const { formatValue } = useFormat();
  const { updateParams } = useNavigation();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any, i: number) => (
          <SessionMobileCard key={row.id || i} row={row} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="id" label={formatMessage(labels.session)} width="100px">
        {(row: any) => (
          <Link href={updateParams({ session: row.id })}>
            <Avatar seed={row.id} size={32} />
          </Link>
        )}
      </DataColumn>
      <DataColumn id="visits" label={formatMessage(labels.visits)} width="80px" />
      <DataColumn id="views" label={formatMessage(labels.views)} width="80px" />
      <DataColumn id="country" label={formatMessage(labels.country)}>
        {(row: any) => (
          <TypeIcon type="country" value={row.country}>
            {formatValue(row.country, 'country')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="city" label={formatMessage(labels.city)} />
      <DataColumn id="browser" label={formatMessage(labels.browser)}>
        {(row: any) => (
          <TypeIcon type="browser" value={row.browser}>
            {formatValue(row.browser, 'browser')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="os" label={formatMessage(labels.os)}>
        {(row: any) => (
          <TypeIcon type="os" value={row.os}>
            {formatValue(row.os, 'os')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="device" label={formatMessage(labels.device)}>
        {(row: any) => (
          <TypeIcon type="device" value={row.device}>
            {formatValue(row.device, 'device')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="lastAt" label={formatMessage(labels.lastSeen)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
    </DataTable>
  );
}
