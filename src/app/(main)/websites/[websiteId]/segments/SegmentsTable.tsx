import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import { SegmentDeleteButton } from '@/app/(main)/websites/[websiteId]/segments/SegmentDeleteButton';
import { SegmentEditButton } from '@/app/(main)/websites/[websiteId]/segments/SegmentEditButton';
import { DateDistance } from '@/components/common/DateDistance';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation } from '@/components/hooks';

function SegmentMobileCard({ row }: { row: any }) {
  const { formatMessage, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        <Link href={renderUrl(`/websites/${websiteId}?segment=${row.id}`, false)}>{row.name}</Link>
      </MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        <Row>
          <SegmentEditButton segmentId={row.id} websiteId={websiteId} />
          <SegmentDeleteButton segmentId={row.id} websiteId={websiteId} name={row.name} />
        </Row>
      </MobileCardRow>
    </MobileCard>
  );
}

export function SegmentsTable({
  displayMode,
  ...props
}: DataTableProps & { displayMode?: string }) {
  const { formatMessage, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <SegmentMobileCard key={row.id} row={row} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {(row: any) => (
          <Link href={renderUrl(`/websites/${websiteId}?segment=${row.id}`, false)}>
            {row.name}
          </Link>
        )}
      </DataColumn>
      <DataColumn id="created" label={formatMessage(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      <DataColumn id="action" align="end" width="100px">
        {(row: any) => {
          const { id, name } = row;

          return (
            <Row>
              <SegmentEditButton segmentId={id} websiteId={websiteId} />
              <SegmentDeleteButton segmentId={id} websiteId={websiteId} name={name} />
            </Row>
          );
        }}
      </DataColumn>
    </DataTable>
  );
}
