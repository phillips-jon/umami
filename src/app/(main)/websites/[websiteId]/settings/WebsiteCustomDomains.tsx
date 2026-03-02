'use client';

import {
  Button,
  Column,
  Form,
  FormField,
  FormSubmitButton,
  Icon,
  Label,
  Loading,
  Row,
  Text,
  TextField,
  useToast,
} from '@umami/react-zen';
import {
  useCustomDomainsQuery,
  useDeleteQuery,
  useMessages,
  useUpdateQuery,
} from '@/components/hooks';
import { CheckCircle, Clock, RefreshCw, Trash2 } from '@/components/icons';
import { DOMAIN_REGEX } from '@/lib/constants';

type CustomDomain = {
  id: string;
  websiteId: string;
  domain: string;
  verified: boolean;
  verifiedAt: string | null;
  createdAt: string;
};

function DomainRow({
  domain,
  cnameTarget,
  websiteId,
  onChanged,
}: {
  domain: CustomDomain;
  cnameTarget: string | null;
  websiteId: string;
  onChanged: () => void;
}) {
  const { formatMessage, labels, messages, getErrorMessage } = useMessages();

  const {
    mutateAsync: deleteDomain,
    isPending: isDeleting,
    touch,
  } = useDeleteQuery(`/websites/${websiteId}/custom-domains/${domain.id}`);

  const {
    mutateAsync: verifyDomain,
    isPending: isVerifying,
    toast,
  } = useUpdateQuery(`/websites/${websiteId}/custom-domains/${domain.id}/verify`);

  const handleDelete = async () => {
    await deleteDomain(null, {
      onSuccess: () => {
        touch('custom-domains');
        onChanged();
      },
    });
  };

  const handleVerify = async () => {
    await verifyDomain(
      {},
      {
        onSuccess: (data: any) => {
          if (data.verified) {
            toast(formatMessage(messages.domainVerified));
          } else {
            toast(
              formatMessage(messages.domainVerificationFailed, {
                message: data.message ?? '',
              }),
            );
          }
          touch('custom-domains');
          onChanged();
        },
      },
    );
  };

  return (
    <Column gap="2">
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" gap="2">
          <Icon size="sm" color={domain.verified ? 'success' : 'muted'}>
            {domain.verified ? <CheckCircle /> : <Clock />}
          </Icon>
          <Text>{domain.domain}</Text>
          <Text color="muted" size="xs">
            {domain.verified ? formatMessage(labels.verified) : formatMessage(labels.pending)}
          </Text>
        </Row>
        <Row gap="2" alignItems="center">
          {!domain.verified && (
            <Button variant="quiet" isDisabled={isVerifying} onPress={handleVerify}>
              <Icon>
                <RefreshCw />
              </Icon>
              {formatMessage(labels.verify)}
            </Button>
          )}
          <Button variant="quiet" isDisabled={isDeleting} onPress={handleDelete}>
            <Icon>
              <Trash2 />
            </Icon>
          </Button>
        </Row>
      </Row>
      {!domain.verified && cnameTarget && (
        <Column gap="1" paddingLeft="6">
          <Text color="muted">{formatMessage(messages.cnameInstructions)}</Text>
          <TextField value={`${domain.domain} CNAME ${cnameTarget}`} isReadOnly allowCopy />
          <Text color="muted" size="sm">
            {formatMessage(messages.dnsPropagationNote)}
          </Text>
        </Column>
      )}
    </Column>
  );
}

export function WebsiteCustomDomains({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels, messages, getErrorMessage } = useMessages();
  const { data, isLoading, refetch } = useCustomDomainsQuery(websiteId);
  const {
    mutateAsync: addDomain,
    isPending,
    error,
    touch,
  } = useUpdateQuery(`/websites/${websiteId}/custom-domains`);

  const domains: CustomDomain[] = data?.data ?? [];
  const cnameTarget: string | null = data?.cnameTarget ?? null;

  const handleSubmit = async (formData: any) => {
    await addDomain(formData, {
      onSuccess: () => {
        touch('custom-domains');
        refetch();
      },
    });
  };

  const checkDomain = (value: string) => {
    if (!DOMAIN_REGEX.test(value)) {
      return formatMessage(messages.invalidDomain);
    }
    return true;
  };

  return (
    <Column gap="6">
      <Column gap>
        <Label>{formatMessage(labels.customDomains)}</Label>
        <Text color="muted">{formatMessage(messages.customDomainsDescription)}</Text>
      </Column>

      {isLoading ? (
        <Loading placement="inline" />
      ) : domains.length > 0 ? (
        <Column gap="4">
          {domains.map(domain => (
            <DomainRow
              key={domain.id}
              domain={domain}
              cnameTarget={cnameTarget}
              websiteId={websiteId}
              onChanged={refetch}
            />
          ))}
        </Column>
      ) : null}

      <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
        <Row gap alignItems="flex-end">
          <FormField
            name="domain"
            label={formatMessage(labels.addDomain)}
            rules={{ required: formatMessage(labels.required), validate: checkDomain }}
            style={{ flex: 1 }}
          >
            <TextField placeholder="t.example.com" autoComplete="off" />
          </FormField>
          <FormSubmitButton isDisabled={isPending}>{formatMessage(labels.add)}</FormSubmitButton>
        </Row>
      </Form>
    </Column>
  );
}
