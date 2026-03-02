'use client';

import { Button, Column, Row, Text } from '@umami/react-zen';
import Papa from 'papaparse';
import { useRef, useState } from 'react';
import { useApi, useMessages, useModified } from '@/components/hooks';

interface ParsedRow {
  name: string;
  url: string;
  slug?: string;
  domain?: string;
  error?: string;
}

const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

const EXAMPLE_CSV =
  'Name,Destination URL,Tracking Domain (optional),Link Slug (optional)\n' +
  'My Campaign,https://example.com/landing,,my-campaign\n' +
  'Blog Post,https://example.com/blog/post,,\n';

function downloadExampleCsv() {
  const blob = new Blob([EXAMPLE_CSV], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'links-import-example.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function validateRow(row: ParsedRow): string | undefined {
  if (!row.name?.trim()) return 'Name is required';
  try {
    new URL(row.url);
  } catch {
    return 'Invalid URL';
  }
  if (row.slug && !SLUG_REGEX.test(row.slug)) {
    return 'Slug may only contain letters, numbers, hyphens and underscores';
  }
  return undefined;
}

export function LinkImportForm({ teamId, onClose }: { teamId?: string; onClose?: () => void }) {
  const { formatMessage, labels, messages } = useMessages();
  const { post } = useApi();
  const { touch } = useModified();
  const inputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{ succeeded: number; failed: any[] } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const validRows = rows.filter(r => !r.error);

  const handleFile = (file: File) => {
    setFileError(null);
    setResult(null);
    setRows([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) =>
        h
          .trim()
          .toLowerCase()
          .replace(/\s*\(.*?\)\s*/g, '') // strip "(optional)" etc.
          .trim()
          .replace(/\s+/g, '_'),
      complete: ({ data }: { data: any[] }) => {
        const parsed: ParsedRow[] = data.map(raw => {
          const row: ParsedRow = {
            name: (raw['name'] || raw['link_name'] || '').trim(),
            url: (raw['destination_url'] || raw['url'] || '').trim(),
            slug: (raw['link_slug'] || raw['slug'] || '').trim() || undefined,
            domain: (raw['tracking_domain'] || raw['domain'] || '').trim() || undefined,
          };
          row.error = validateRow(row);
          return row;
        });
        if (parsed.length === 0) {
          setFileError('No rows found in CSV');
        } else {
          setRows(parsed);
        }
      },
      error: (err: any) => setFileError(err.message),
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!validRows.length) return;
    setIsPending(true);
    try {
      const res = await post('/links/import', {
        rows: validRows.map(r => ({
          name: r.name,
          url: r.url,
          ...(r.slug ? { slug: r.slug } : {}),
          ...(r.domain ? { domain: r.domain } : {}),
        })),
        teamId: teamId ?? null,
      });
      setResult(res);
      touch('links');
    } finally {
      setIsPending(false);
    }
  };

  if (result) {
    return (
      <Column gap="4">
        <Text>
          {result.succeeded} link{result.succeeded !== 1 ? 's' : ''} imported successfully.
        </Text>
        {result.failed.length > 0 && (
          <Column gap="1">
            <Text color="muted">Failed rows:</Text>
            {result.failed.map((f: any) => (
              <Text key={f.row} color="red">
                Row {f.row}: {f.reason || 'Unknown error'}
              </Text>
            ))}
          </Column>
        )}
        <Row justifyContent="flex-end">
          <Button onPress={onClose}>{formatMessage(labels.dismiss)}</Button>
        </Row>
      </Column>
    );
  }

  return (
    <Column gap="4">
      <Row alignItems="baseline" gap="3" style={{ flexWrap: 'wrap' }}>
        <Text color="muted">{formatMessage(messages.importLinksHelp)}</Text>
        <Button variant="quiet" onPress={downloadExampleCsv} style={{ whiteSpace: 'nowrap' }}>
          Download example CSV
        </Button>
      </Row>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Text color="muted">
          {rows.length > 0
            ? `${rows.length} rows loaded — click to replace`
            : 'Drop a CSV file here or click to browse'}
        </Text>
      </div>

      {fileError && <Text color="red">{fileError}</Text>}

      {/* Preview table */}
      {rows.length > 0 && (
        <div style={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px' }}>Name</th>
                <th style={{ padding: '6px 8px' }}>Destination URL</th>
                <th style={{ padding: '6px 8px' }}>Domain</th>
                <th style={{ padding: '6px 8px' }}>Slug</th>
                <th style={{ padding: '6px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    opacity: row.error ? 0.5 : 1,
                  }}
                >
                  <td style={{ padding: '6px 8px' }}>{row.name || '—'}</td>
                  <td
                    style={{
                      padding: '6px 8px',
                      maxWidth: '180px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.url || '—'}
                  </td>
                  <td style={{ padding: '6px 8px' }}>{row.domain || '—'}</td>
                  <td style={{ padding: '6px 8px' }}>
                    {row.slug || <span style={{ color: 'var(--font-color300)' }}>auto</span>}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    {row.error ? (
                      <span style={{ color: 'var(--color-danger, red)', fontSize: '12px' }}>
                        {row.error}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-success, green)', fontSize: '12px' }}>
                        ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > 0 && rows.some(r => r.error) && (
        <Text color="muted">
          {rows.filter(r => r.error).length} invalid row
          {rows.filter(r => r.error).length !== 1 ? 's' : ''} will be skipped.
        </Text>
      )}

      <Row justifyContent="flex-end" gap="3">
        {onClose && (
          <Button isDisabled={isPending} onPress={onClose}>
            {formatMessage(labels.cancel)}
          </Button>
        )}
        <Button
          variant="primary"
          isDisabled={isPending || validRows.length === 0}
          onPress={handleSubmit}
        >
          {isPending
            ? formatMessage(labels.importing)
            : `${formatMessage(labels.import)} ${validRows.length > 0 ? `${validRows.length} ` : ''}${formatMessage(labels.links).toLowerCase()}`}
        </Button>
      </Row>
    </Column>
  );
}
