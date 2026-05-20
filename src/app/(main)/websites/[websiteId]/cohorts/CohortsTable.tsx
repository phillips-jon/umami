import { Column, DataColumn, DataTable, type DataTableProps, Row, Text } from '@umami/react-zen';
import { CohortDeleteButton } from '@/app/(main)/websites/[websiteId]/cohorts/CohortDeleteButton';
import { CohortEditButton } from '@/app/(main)/websites/[websiteId]/cohorts/CohortEditButton';
import { DateDistance } from '@/components/common/DateDistance';
import Link from '@/components/common/Link';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation } from '@/components/hooks';
import { filtersObjectToArray } from '@/lib/params';

function CohortMobileCard({ row }: { row: any }) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();

  return (
    <MobileCard>
      <MobileCardField label={t(labels.name)}>
        <Link href={renderUrl(`/websites/${websiteId}?cohort=${row.id}`, false)}>{row.name}</Link>
      </MobileCardField>
      <MobileCardRow>
        <Text size="sm" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        <Row>
          <CohortEditButton
            cohortId={row.id}
            websiteId={websiteId}
            filters={filtersObjectToArray(row.parameters)}
          />
          <CohortDeleteButton cohortId={row.id} websiteId={websiteId} name={row.name} />
        </Row>
      </MobileCardRow>
    </MobileCard>
  );
}

export function CohortsTable(props: DataTableProps) {
  const { t, labels } = useMessages();
  const { websiteId, renderUrl } = useNavigation();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <CohortMobileCard key={row.id} row={row} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={t(labels.name)}>
        {(row: any) => (
          <Link href={renderUrl(`/websites/${websiteId}?cohort=${row.id}`, false)}>{row.name}</Link>
        )}
      </DataColumn>
      <DataColumn id="created" label={t(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
      <DataColumn id="action" align="end" width="100px">
        {(row: any) => {
          const { id, name, parameters } = row;

          return (
            <Row>
              <CohortEditButton
                cohortId={id}
                websiteId={websiteId}
                filters={filtersObjectToArray(parameters)}
              />
              <CohortDeleteButton cohortId={id} websiteId={websiteId} name={name} />
            </Row>
          );
        }}
      </DataColumn>
    </DataTable>
  );
}
