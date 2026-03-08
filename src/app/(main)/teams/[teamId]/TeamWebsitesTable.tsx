import { Column, DataColumn, DataTable, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import { TeamMemberEditButton } from '@/app/(main)/teams/[teamId]/TeamMemberEditButton';
import { TeamMemberRemoveButton } from '@/app/(main)/teams/[teamId]/TeamMemberRemoveButton';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile } from '@/components/hooks';
import { ROLES } from '@/lib/constants';

function TeamWebsiteMobileCard({
  row,
  teamId,
  allowEdit,
}: {
  row: any;
  teamId: string;
  allowEdit: boolean;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>
      </MobileCardField>
      <MobileCardField label={formatMessage(labels.domain)}>{row.domain}</MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          {row?.createUser?.username}
        </Text>
        {allowEdit && row?.role !== ROLES.teamOwner && (
          <Row alignItems="center">
            <TeamMemberEditButton teamId={teamId} userId={row?.user?.id} role={row?.role} />
            <TeamMemberRemoveButton
              teamId={teamId}
              userId={row?.user?.id}
              userName={row?.user?.username}
            />
          </Row>
        )}
      </MobileCardRow>
    </MobileCard>
  );
}

export function TeamWebsitesTable({
  teamId,
  data = [],
  allowEdit,
  displayMode,
}: {
  teamId: string;
  data: any[];
  allowEdit: boolean;
  displayMode?: string;
}) {
  const { formatMessage, labels } = useMessages();
  const { isMobile } = useMobile();

  if (isMobile) {
    return (
      <Column gap="4">
        {data.map((row: any) => (
          <TeamWebsiteMobileCard key={row.id} row={row} teamId={teamId} allowEdit={allowEdit} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable data={data}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {(row: any) => <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>}
      </DataColumn>
      <DataColumn id="domain" label={formatMessage(labels.domain)} />
      <DataColumn id="createdBy" label={formatMessage(labels.createdBy)}>
        {(row: any) => row?.createUser?.username}
      </DataColumn>
      {allowEdit && (
        <DataColumn id="action" align="end">
          {(row: any) => {
            if (row?.role === ROLES.teamOwner) {
              return null;
            }

            return (
              <Row alignItems="center">
                <TeamMemberEditButton teamId={teamId} userId={row?.user?.id} role={row?.role} />
                <TeamMemberRemoveButton
                  teamId={teamId}
                  userId={row?.user?.id}
                  userName={row?.user?.username}
                />
              </Row>
            );
          }}
        </DataColumn>
      )}
    </DataTable>
  );
}
