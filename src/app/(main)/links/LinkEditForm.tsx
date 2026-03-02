'use client';

import {
  Button,
  Column,
  Form,
  FormField,
  FormSubmitButton,
  Icon,
  Label,
  ListItem,
  Loading,
  Row,
  Select,
  TextField,
} from '@umami/react-zen';
import { useEffect, useState } from 'react';
import {
  useConfig,
  useLinkQuery,
  useMessages,
  useUserCustomDomainsQuery,
} from '@/components/hooks';
import { useUpdateQuery } from '@/components/hooks/queries/useUpdateQuery';
import { RefreshCw } from '@/components/icons';
import { LINKS_URL } from '@/lib/constants';
import { getRandomChars } from '@/lib/generate';
import { isValidUrl } from '@/lib/url';

const generateId = () => getRandomChars(9);

export function LinkEditForm({
  linkId,
  teamId,
  onSave,
  onClose,
}: {
  linkId?: string;
  teamId?: string;
  onSave?: () => void;
  onClose?: () => void;
}) {
  const { formatMessage, labels, messages, getErrorMessage } = useMessages();
  const { mutateAsync, error, isPending, touch, toast } = useUpdateQuery(
    linkId ? `/links/${linkId}` : '/links',
    {
      id: linkId,
      teamId,
    },
  );
  const config = useConfig();
  const hostUrl = config?.linksUrl || LINKS_URL;
  const { data, isLoading } = useLinkQuery(linkId);
  const [slug, setSlug] = useState(generateId());
  const [customDomainId, setCustomDomainId] = useState<string>('');

  const { data: customDomainsData } = useUserCustomDomainsQuery();
  const verifiedDomains = config?.customDomainsEnabled ? (customDomainsData?.data ?? []) : [];

  const selectedDomain = verifiedDomains.find((d: any) => d.id === customDomainId);
  const linkBase = selectedDomain ? `https://${selectedDomain.domain}` : hostUrl;

  const handleSubmit = async (formData: any) => {
    await mutateAsync(
      { ...formData, customDomainId: customDomainId || null },
      {
        onSuccess: async () => {
          toast(formatMessage(messages.saved));
          touch('links');
          onSave?.();
          onClose?.();
        },
      },
    );
  };

  const handleSlug = () => {
    const newSlug = generateId();
    setSlug(newSlug);
    return newSlug;
  };

  const checkUrl = (url: string) => {
    if (!isValidUrl(url)) {
      return formatMessage(labels.invalidUrl);
    }
    return true;
  };

  useEffect(() => {
    if (data) {
      setSlug(data.slug);
      setCustomDomainId(data.customDomainId ?? '');
    }
  }, [data]);

  if (linkId && isLoading) {
    return <Loading placement="absolute" />;
  }

  return (
    <Form onSubmit={handleSubmit} error={getErrorMessage(error)} defaultValues={{ slug, ...data }}>
      {({ setValue }) => {
        return (
          <>
            <FormField
              label={formatMessage(labels.name)}
              name="name"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField autoComplete="off" autoFocus />
            </FormField>

            <FormField
              label={formatMessage(labels.destinationUrl)}
              name="url"
              rules={{ required: formatMessage(labels.required), validate: checkUrl }}
            >
              <TextField placeholder="https://example.com" autoComplete="off" />
            </FormField>

            {config?.customDomainsEnabled && verifiedDomains.length > 0 && (
              <Column gap="1">
                <Label>{formatMessage(labels.trackingDomain)}</Label>
                <Select
                  value={customDomainId}
                  onChange={(value: string) => setCustomDomainId(value)}
                >
                  <ListItem key="" id="">
                    {formatMessage(labels.defaultDomain)}
                  </ListItem>
                  {verifiedDomains.map((d: any) => (
                    <ListItem key={d.id} id={d.id}>
                      {d.domain}
                    </ListItem>
                  ))}
                </Select>
              </Column>
            )}

            <Column gap="1">
              <Label>{formatMessage(labels.link)}</Label>
              <Row alignItems="center" gap>
                <span style={{ whiteSpace: 'nowrap', color: 'var(--font-color300)' }}>
                  {linkBase}/
                </span>
                <FormField
                  name="slug"
                  rules={{
                    required: formatMessage(labels.required),
                    validate: (v: string) =>
                      /^[a-zA-Z0-9_-]+$/.test(v) || formatMessage(labels.invalidSlug),
                  }}
                  style={{ flex: 1 }}
                >
                  <TextField autoComplete="off" onChange={(v: string) => setSlug(v)} />
                </FormField>
                <Button
                  variant="quiet"
                  onPress={() => {
                    const next = handleSlug();
                    setValue('slug', next, { shouldDirty: true });
                  }}
                >
                  <Icon>
                    <RefreshCw />
                  </Icon>
                </Button>
              </Row>
            </Column>

            <Row justifyContent="flex-end" paddingTop="3" gap="3">
              {onClose && (
                <Button isDisabled={isPending} onPress={onClose}>
                  {formatMessage(labels.cancel)}
                </Button>
              )}
              <FormSubmitButton>{formatMessage(labels.save)}</FormSubmitButton>
            </Row>
          </>
        );
      }}
    </Form>
  );
}
