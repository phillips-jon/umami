'use client';
import { Column, Row } from '@umami/react-zen';
import { LinksDataTable } from '@/app/(main)/links/LinksDataTable';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { LinkAddButton } from './LinkAddButton';
import { LinkImportButton } from './LinkImportButton';

export function LinksPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.links)}>
          <Row gap="4" alignItems="center">
            <LinkImportButton teamId={teamId} />
            <LinkAddButton teamId={teamId} />
          </Row>
        </PageHeader>
        <Panel>
          <LinksDataTable />
        </Panel>
      </Column>
    </PageBody>
  );
}
