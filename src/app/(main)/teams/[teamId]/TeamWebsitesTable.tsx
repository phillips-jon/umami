import { Column, DataColumn, DataTable, Row, Text } from '@umami/react-zen';
import { TeamMemberEditButton } from '@/app/(main)/teams/[teamId]/TeamMemberEditButton';
import { TeamMemberRemoveButton } from '@/app/(main)/teams/[teamId]/TeamMemberRemoveButton';
import Link from '@/components/common/Link';
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
  const { t, labels } = useMessages();

  return (
    <MobileCard>
      <MobileCardField label={t(labels.name)}>
        <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>
      </MobileCardField>
      <MobileCardField label={t(labels.domain)}>{row.domain}</MobileCardField>
      <MobileCardRow>
        <Text size="sm" color="muted">
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
}: {
  teamId: string;
  data: any[];
  allowEdit: boolean;
}) {
  const { t, labels } = useMessages();
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
      <DataColumn id="name" label={t(labels.name)}>
        {(row: any) => <Link href={`/teams/${teamId}/websites/${row.id}`}>{row.name}</Link>}
      </DataColumn>
      <DataColumn id="domain" label={t(labels.domain)} />
      <DataColumn id="createdBy" label={t(labels.createdBy)}>
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
