'use client';

import { Column, Label, ListItem, Select, Text, TextField } from '@umami/react-zen';
import { useState } from 'react';
import { useConfig, useCustomDomainsQuery, useMessages } from '@/components/hooks';

const SCRIPT_NAME = 'script.js';

export function WebsiteTrackingCode({
  websiteId,
  hostUrl,
}: {
  websiteId: string;
  hostUrl?: string;
}) {
  const { formatMessage, messages, labels } = useMessages();
  const config = useConfig();
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const { data: customDomainsData } = useCustomDomainsQuery(
    config?.customDomainsEnabled ? websiteId : '',
  );
  const verifiedDomains = (customDomainsData?.data ?? []).filter((d: any) => d.verified);

  const trackerScriptName =
    config?.trackerScriptName?.split(',')?.map((n: string) => n.trim())?.[0] || SCRIPT_NAME;

  const getDefaultUrl = () => {
    if (config?.cloudMode) {
      return `${process.env.cloudUrl}/${trackerScriptName}`;
    }

    return `${hostUrl || window?.location?.origin || ''}${
      process.env.basePath || ''
    }/${trackerScriptName}`;
  };

  const getUrl = (domain?: string) => {
    if (trackerScriptName?.startsWith('http')) {
      return trackerScriptName;
    }

    if (domain) {
      return `https://${domain}${process.env.basePath || ''}/${trackerScriptName}`;
    }

    return getDefaultUrl();
  };

  const url = getUrl(selectedDomain || undefined);
  const code = `<script defer src="${url}" data-website-id="${websiteId}"></script>`;

  const showDomainSelector = config?.customDomainsEnabled && verifiedDomains.length > 0;

  return (
    <Column gap>
      <Label>{formatMessage(labels.trackingCode)}</Label>
      <Text color="muted">{formatMessage(messages.trackingCode)}</Text>
      {showDomainSelector && (
        <Column gap="1">
          <Label>{formatMessage(labels.trackingDomain)}</Label>
          <Select value={selectedDomain} onChange={(value: string) => setSelectedDomain(value)}>
            <ListItem key="" id="">
              {formatMessage(labels.defaultDomain)}
            </ListItem>
            {verifiedDomains.map((d: any) => (
              <ListItem key={d.id} id={d.domain}>
                {d.domain}
              </ListItem>
            ))}
          </Select>
        </Column>
      )}
      <TextField value={code} isReadOnly allowCopy asTextArea resize="none" />
    </Column>
  );
}
