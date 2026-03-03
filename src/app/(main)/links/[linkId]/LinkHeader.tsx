import { IconLabel } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { PageHeader } from '@/components/common/PageHeader';
import { useLink, useMessages, useSlug } from '@/components/hooks';
import { ExternalLink, Link } from '@/components/icons';

export function LinkHeader() {
  const { formatMessage, labels } = useMessages();
  const { getSlugUrl } = useSlug('link');
  const link = useLink();
  const viewUrl = link.customDomain
    ? `https://${link.customDomain.domain}/${link.slug}`
    : getSlugUrl(link.slug);

  return (
    <PageHeader title={link.name} description={link.url} icon={<Link />}>
      <LinkButton href={viewUrl} target="_blank" prefetch={false} asAnchor>
        <IconLabel icon={<ExternalLink />} label={formatMessage(labels.view)} />
      </LinkButton>
    </PageHeader>
  );
}
