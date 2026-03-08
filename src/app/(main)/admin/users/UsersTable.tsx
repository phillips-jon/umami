import { Column, DataColumn, DataTable, Icon, MenuItem, Modal, Row, Text } from '@umami/react-zen';
import Link from 'next/link';
import { useState } from 'react';
import { DateDistance } from '@/components/common/DateDistance';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile } from '@/components/hooks';
import { Edit, Trash } from '@/components/icons';
import { MenuButton } from '@/components/input/MenuButton';
import { ROLES } from '@/lib/constants';
import { UserDeleteForm } from './UserDeleteForm';

function UserMobileCard({
  row,
  showActions,
  onDelete,
}: {
  row: any;
  showActions: boolean;
  onDelete: (user: any) => void;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.username)}>
        <Link href={`/admin/users/${row.id}`}>{row.username}</Link>
      </MobileCardField>
      <MobileCardRow>
        <Text size="2" color="muted">
          {formatMessage(
            labels[Object.keys(ROLES).find(key => ROLES[key] === row.role)] || labels.unknown,
          )}
        </Text>
        <Text size="2" color="muted">
          {row._count.websites} {formatMessage(labels.websites).toLowerCase()}
        </Text>
      </MobileCardRow>
      <MobileCardRow>
        <Text size="2" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        {showActions && (
          <MenuButton>
            <MenuItem href={`/admin/users/${row.id}`} data-test="link-button-edit">
              <Row alignItems="center" gap>
                <Icon>
                  <Edit />
                </Icon>
                <Text>{formatMessage(labels.edit)}</Text>
              </Row>
            </MenuItem>
            <MenuItem id="delete" onAction={() => onDelete(row)} data-test="link-button-delete">
              <Row alignItems="center" gap>
                <Icon>
                  <Trash />
                </Icon>
                <Text>{formatMessage(labels.delete)}</Text>
              </Row>
            </MenuItem>
          </MenuButton>
        )}
      </MobileCardRow>
    </MobileCard>
  );
}

export function UsersTable({
  data = [],
  showActions = true,
  displayMode,
}: {
  data: any[];
  showActions?: boolean;
  displayMode?: string;
}) {
  const { formatMessage, labels } = useMessages();
  const [deleteUser, setDeleteUser] = useState(null);
  const { isMobile } = useMobile();

  return (
    <>
      {isMobile ? (
        <Column gap="4">
          {data.map((row: any) => (
            <UserMobileCard
              key={row.id}
              row={row}
              showActions={showActions}
              onDelete={setDeleteUser}
            />
          ))}
        </Column>
      ) : (
        <DataTable data={data}>
          <DataColumn id="username" label={formatMessage(labels.username)} width="2fr">
            {(row: any) => <Link href={`/admin/users/${row.id}`}>{row.username}</Link>}
          </DataColumn>
          <DataColumn id="role" label={formatMessage(labels.role)}>
            {(row: any) =>
              formatMessage(
                labels[Object.keys(ROLES).find(key => ROLES[key] === row.role)] || labels.unknown,
              )
            }
          </DataColumn>
          <DataColumn id="websites" label={formatMessage(labels.websites)}>
            {(row: any) => row._count.websites}
          </DataColumn>
          <DataColumn id="created" label={formatMessage(labels.created)}>
            {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
          </DataColumn>
          {showActions && (
            <DataColumn id="action" align="end" width="100px">
              {(row: any) => {
                const { id } = row;

                return (
                  <MenuButton>
                    <MenuItem href={`/admin/users/${id}`} data-test="link-button-edit">
                      <Row alignItems="center" gap>
                        <Icon>
                          <Edit />
                        </Icon>
                        <Text>{formatMessage(labels.edit)}</Text>
                      </Row>
                    </MenuItem>
                    <MenuItem
                      id="delete"
                      onAction={() => setDeleteUser(row)}
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
      <Modal isOpen={!!deleteUser}>
        <UserDeleteForm
          userId={deleteUser?.id}
          username={deleteUser?.username}
          onClose={() => {
            setDeleteUser(null);
          }}
        />
      </Modal>
    </>
  );
}
