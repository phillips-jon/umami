import { Column, DataColumn, DataTable, type DataTableProps, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile } from '@/components/hooks';
import { ROLES } from '@/lib/constants';

export interface TeamsTableProps extends DataTableProps {
  renderLink?: (row: any) => ReactNode;
}

function TeamMobileCard({ row, renderLink }: { row: any; renderLink?: (row: any) => ReactNode }) {
  const { formatMessage, labels } = useMessages();
  const owner = row?.members?.find(({ role }) => role === ROLES.teamOwner)?.user?.username;

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        {renderLink ? renderLink(row) : row.name}
      </MobileCardField>
      <MobileCardField label={formatMessage(labels.owner)}>{owner}</MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          {row?._count?.members} {formatMessage(labels.members).toLowerCase()}
        </Text>
        <Text size="2" color="muted">
          {row?._count?.websites} {formatMessage(labels.websites).toLowerCase()}
        </Text>
      </MobileCardRow>
    </MobileCard>
  );
}

export function TeamsTable({
  renderLink,
  displayMode,
  ...props
}: TeamsTableProps & { displayMode?: string }) {
  const { formatMessage, labels } = useMessages();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <TeamMobileCard key={row.id} row={row} renderLink={renderLink} />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {renderLink}
      </DataColumn>
      <DataColumn id="owner" label={formatMessage(labels.owner)}>
        {(row: any) => row?.members?.find(({ role }) => role === ROLES.teamOwner)?.user?.username}
      </DataColumn>
      <DataColumn id="members" label={formatMessage(labels.members)} align="end">
        {(row: any) => row?._count?.members}
      </DataColumn>
      <DataColumn id="websites" label={formatMessage(labels.websites)} align="end">
        {(row: any) => row?._count?.websites}
      </DataColumn>
    </DataTable>
  );
}
