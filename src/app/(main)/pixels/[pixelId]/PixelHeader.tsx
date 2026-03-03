import { IconLabel } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, usePixel, useSlug } from '@/components/hooks';
import { ExternalLink, Grid2x2 } from '@/components/icons';

export function PixelHeader() {
  const { formatMessage, labels } = useMessages();
  const { getSlugUrl } = useSlug('pixel');
  const pixel = usePixel();
  const viewUrl = pixel.customDomain
    ? `https://${pixel.customDomain.domain}/${pixel.slug}`
    : getSlugUrl(pixel.slug);

  return (
    <PageHeader title={pixel.name} icon={<Grid2x2 />}>
      <LinkButton href={viewUrl} target="_blank" prefetch={false} asAnchor>
        <IconLabel icon={<ExternalLink />} label={formatMessage(labels.view)} />
      </LinkButton>
    </PageHeader>
  );
}
