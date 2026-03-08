import { Column, DataColumn, DataTable, Row, Text } from '@umami/react-zen';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile } from '@/components/hooks';
import { ROLES } from '@/lib/constants';
import { TeamMemberEditButton } from './TeamMemberEditButton';
import { TeamMemberRemoveButton } from './TeamMemberRemoveButton';

function TeamMemberMobileCard({
  row,
  teamId,
  allowEdit,
  roles,
}: {
  row: any;
  teamId: string;
  allowEdit: boolean;
  roles: Record<string, string>;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.username)}>
        {row?.user?.username}
      </MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          {roles[row?.role]}
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

export function TeamMembersTable({
  data = [],
  teamId,
  allowEdit = false,
  displayMode,
}: {
  data: any[];
  teamId: string;
  allowEdit: boolean;
  displayMode?: string;
}) {
  const { formatMessage, labels } = useMessages();
  const { isMobile } = useMobile();

  const roles = {
    [ROLES.teamOwner]: formatMessage(labels.teamOwner),
    [ROLES.teamManager]: formatMessage(labels.teamManager),
    [ROLES.teamMember]: formatMessage(labels.teamMember),
    [ROLES.teamViewOnly]: formatMessage(labels.viewOnly),
  };

  if (isMobile) {
    return (
      <Column gap="4">
        {data.map((row: any, i: number) => (
          <TeamMemberMobileCard
            key={row?.user?.id || i}
            row={row}
            teamId={teamId}
            allowEdit={allowEdit}
            roles={roles}
          />
        ))}
      </Column>
    );
  }

  return (
    <DataTable data={data}>
      <DataColumn id="username" label={formatMessage(labels.username)}>
        {(row: any) => row?.user?.username}
      </DataColumn>
      <DataColumn id="role" label={formatMessage(labels.role)}>
        {(row: any) => roles[row?.role]}
      </DataColumn>
      {allowEdit && (
        <DataColumn id="action" align="end">
          {(row: any) => {
            if (row?.role === ROLES.teamOwner) {
              return null;
            }

            return (
              <Row alignItems="center" maxHeight="20px">
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
