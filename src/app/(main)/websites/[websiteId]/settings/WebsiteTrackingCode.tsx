'use client';

import { Column, Label, ListItem, Select, Text, TextField } from '@umami/react-zen';
import { useState } from 'react';
import { useConfig, useCustomDomainsQuery, useMessages } from '@/components/hooks';

const SCRIPT_NAME = 'script.js';

export function WebsiteTrackingCode({
  websiteId,
  hostUrl,
  showHeader = true,
}: {
  websiteId: string;
  hostUrl?: string;
  showHeader?: boolean;
}) {
  const { t, messages, labels } = useMessages();
  const config = useConfig();
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const { data: customDomainsData } = useCustomDomainsQuery(
    config?.customDomainsEnabled ? websiteId : '',
  );
  const verifiedDomains = (customDomainsData?.data ?? []).filter((d: any) => d.verified);

  const trackerScriptName =
    config?.trackerScriptName?.split(',')?.map((n: string) => n.trim())?.[0] || SCRIPT_NAME;

  const getDefaultUrl = (scriptName: string) => {
    if (config?.cloudMode) {
      return `${process.env.cloudUrl}/${scriptName}`;
    }

    return `${hostUrl || window?.location?.origin || ''}${
      process.env.basePath || ''
    }/${scriptName}`;
  };

  const getUrl = (domain?: string) => {
    if (trackerScriptName?.startsWith('http')) {
      return trackerScriptName;
    }

    if (domain) {
      return `https://${domain}${process.env.basePath || ''}/${trackerScriptName}`;
    }

    return getDefaultUrl(trackerScriptName);
  };

  const url = getUrl(selectedDomain || undefined);
  const code = `<script defer src="${url}" data-website-id="${websiteId}"></script>`;

  const showDomainSelector = config?.customDomainsEnabled && verifiedDomains.length > 0;

  return (
    <Column gap>
      {showHeader && <Label>{t(labels.trackingCode)}</Label>}
      <Text color="muted">{t(messages.trackingCode)}</Text>
      {showDomainSelector && (
        <Column gap="1">
          <Label>{t(labels.trackingDomain)}</Label>
          <Select value={selectedDomain} onChange={value => setSelectedDomain(value as string)}>
            <ListItem key="" id="">
              {t(labels.defaultDomain)}
            </ListItem>
            {verifiedDomains.map((d: any) => (
              <ListItem key={d.id} id={d.domain}>
                {d.domain}
              </ListItem>
            ))}
          </Select>
        </Column>
      )}
      <TextField
        value={code}
        isReadOnly
        allowCopy
        asTextArea
        resize="none"
        className="code-textarea"
      />
    </Column>
  );
}
