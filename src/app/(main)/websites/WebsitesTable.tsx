import { Column, DataColumn, DataTable, type DataTableProps, Icon } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { LinkButton } from '@/components/common/LinkButton';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { useMessages, useMobile, useNavigation } from '@/components/hooks';
import { SquarePen } from '@/components/icons';

export interface WebsitesTableProps extends DataTableProps {
  showActions?: boolean;
  allowEdit?: boolean;
  allowView?: boolean;
  renderLink?: (row: any) => ReactNode;
}

function WebsiteMobileCard({
  row,
  showActions,
  renderLink,
}: {
  row: any;
  showActions?: boolean;
  renderLink?: (row: any) => ReactNode;
}) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();

  return (
    <MobileCard>
      <MobileCardField label={formatMessage(labels.name)}>
        {renderLink ? renderLink(row) : row.name}
      </MobileCardField>
      <MobileCardField label={formatMessage(labels.domain)}>{row.domain}</MobileCardField>
      {showActions && (
        <MobileCardRow>
          <div />
          <LinkButton href={renderUrl(`/websites/${row.id}/settings`)} variant="quiet">
            <Icon>
              <SquarePen />
            </Icon>
          </LinkButton>
        </MobileCardRow>
      )}
    </MobileCard>
  );
}

export function WebsitesTable({
  showActions,
  renderLink,
  displayMode,
  ...props
}: WebsitesTableProps & { displayMode?: string }) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any) => (
          <WebsiteMobileCard
            key={row.id}
            row={row}
            showActions={showActions}
            renderLink={renderLink}
          />
        ))}
      </Column>
    );
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {renderLink}
      </DataColumn>
      <DataColumn id="domain" label={formatMessage(labels.domain)} />
      {showActions && (
        <DataColumn id="action" label=" " align="end">
          {(row: any) => {
            const websiteId = row.id;

            return (
              <LinkButton href={renderUrl(`/websites/${websiteId}/settings`)} variant="quiet">
                <Icon>
                  <SquarePen />
                </Icon>
              </LinkButton>
            );
          }}
        </DataColumn>
      )}
    </DataTable>
  );
}
