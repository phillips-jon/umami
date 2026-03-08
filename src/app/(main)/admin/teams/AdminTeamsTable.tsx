import {
  Column,
  DataColumn,
  DataTable,
  Dialog,
  Icon,
  MenuItem,
  Modal,
  Row,
  Text,
} from '@umami/react-zen';
import Link from 'next/link';
import { useState } from 'react';
import { DateDistance } from '@/components/common/DateDistance';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile } from '@/components/hooks';
import { Edit, Trash } from '@/components/icons';
import { MenuButton } from '@/components/input/MenuButton';
import { TeamDeleteForm } from '../../teams/[teamId]/TeamDeleteForm';

function AdminTeamMobileCard({
  row,
  showActions,
  onDelete,
}: {
  row: any;
  showActions: boolean;
  onDelete: (id: string) => void;
}) {
  const { formatMessage, labels } = useMessages();
  const ownerName = row?.members?.[0]?.user?.username;

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        <Link href={`/admin/teams/${row.id}`}>{row.name}</Link>
      </MobileCardField>
      <MobileCardField label={formatMessage(labels.owner)}>
        <Link href={`/admin/users/${row?.members?.[0]?.user?.id}`}>{ownerName}</Link>
      </MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          {row?._count?.members} {formatMessage(labels.members).toLowerCase()}
          {' / '}
          {row?._count?.websites} {formatMessage(labels.websites).toLowerCase()}
        </Text>
        <Text size="2" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
      </MobileCardRow>
      {showActions && (
        <MobileCardRow>
          <div />
          <MenuButton>
            <MenuItem href={`/admin/teams/${row.id}`} data-test="link-button-edit">
              <Row alignItems="center" gap>
                <Icon>
                  <Edit />
                </Icon>
                <Text>{formatMessage(labels.edit)}</Text>
              </Row>
            </MenuItem>
            <MenuItem id="delete" onAction={() => onDelete(row.id)} data-test="link-button-delete">
              <Row alignItems="center" gap>
                <Icon>
                  <Trash />
                </Icon>
                <Text>{formatMessage(labels.delete)}</Text>
              </Row>
            </MenuItem>
          </MenuButton>
        </MobileCardRow>
      )}
    </MobileCard>
  );
}

export function AdminTeamsTable({
  data = [],
  showActions = true,
  displayMode,
}: {
  data: any[];
  showActions?: boolean;
  displayMode?: string;
}) {
  const { formatMessage, labels } = useMessages();
  const [deleteTeam, setDeleteTeam] = useState(null);
  const { isMobile } = useMobile();

  return (
    <>
      {isMobile ? (
        <Column gap="4">
          {data.map((row: any) => (
            <AdminTeamMobileCard
              key={row.id}
              row={row}
              showActions={showActions}
              onDelete={setDeleteTeam}
            />
          ))}
        </Column>
      ) : (
        <DataTable data={data}>
          <DataColumn id="name" label={formatMessage(labels.name)} width="1fr">
            {(row: any) => <Link href={`/admin/teams/${row.id}`}>{row.name}</Link>}
          </DataColumn>
          <DataColumn id="websites" label={formatMessage(labels.members)} width="140px">
            {(row: any) => row?._count?.members}
          </DataColumn>
          <DataColumn id="members" label={formatMessage(labels.websites)} width="140px">
            {(row: any) => row?._count?.websites}
          </DataColumn>
          <DataColumn id="owner" label={formatMessage(labels.owner)}>
            {(row: any) => {
              const name = row?.members?.[0]?.user?.username;

              return (
                <Text title={name} truncate>
                  <Link href={`/admin/users/${row?.members?.[0]?.user?.id}`}>{name}</Link>
                </Text>
              );
            }}
          </DataColumn>
          <DataColumn id="created" label={formatMessage(labels.created)} width="160px">
            {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
          </DataColumn>
          {showActions && (
            <DataColumn id="action" align="end" width="50px">
              {(row: any) => {
                const { id } = row;

                return (
                  <MenuButton>
                    <MenuItem href={`/admin/teams/${id}`} data-test="link-button-edit">
                      <Row alignItems="center" gap>
                        <Icon>
                          <Edit />
                        </Icon>
                        <Text>{formatMessage(labels.edit)}</Text>
                      </Row>
                    </MenuItem>
                    <MenuItem
                      id="delete"
                      onAction={() => setDeleteTeam(id)}
                      data-test="link-button-delete"
                    >
                      <Row alignItems="center" gap>
                        <Icon>
                          <Trash />
                        </Icon>
                        <Text>{formatMessage(labels.delete)}</Text>
                      </Row>
                    </MenuItem>
                  </MenuButton>
                );
              }}
            </DataColumn>
          )}
        </DataTable>
      )}
      <Modal isOpen={!!deleteTeam}>
        <Dialog style={{ width: 400 }}>
          <TeamDeleteForm teamId={deleteTeam} onClose={() => setDeleteTeam(null)} />
        </Dialog>
      </Modal>
    </>
  );
}
