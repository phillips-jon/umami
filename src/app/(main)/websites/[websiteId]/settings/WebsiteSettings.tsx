import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { useConfig, useWebsite } from '@/components/hooks';
import { WebsiteCustomDomains } from './WebsiteCustomDomains';
import { WebsiteData } from './WebsiteData';
import { WebsiteEditForm } from './WebsiteEditForm';
import { WebsiteShareForm } from './WebsiteShareForm';
import { WebsiteTrackingCode } from './WebsiteTrackingCode';

export function WebsiteSettings({ websiteId }: { websiteId: string; openExternal?: boolean }) {
  const website = useWebsite();
  const config = useConfig();

  return (
    <Column gap="6">
      <Panel>
        <WebsiteEditForm websiteId={websiteId} />
      </Panel>
      <Panel>
        <WebsiteTrackingCode websiteId={websiteId} />
      </Panel>
      {config?.customDomainsEnabled && (
        <Panel>
          <WebsiteCustomDomains websiteId={websiteId} />
        </Panel>
      )}
      <Panel>
        <WebsiteShareForm websiteId={websiteId} shareId={website.shareId} />
      </Panel>
      <Panel>
        <WebsiteData websiteId={websiteId} />
      </Panel>
    </Column>
  );
}
