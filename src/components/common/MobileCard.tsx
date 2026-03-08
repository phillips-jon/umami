import { Column, Row, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';

export function MobileCard({ children }: { children: ReactNode }) {
  return (
    <Column
      gap="3"
      style={{
        padding: 'var(--spacing-6)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
      }}
    >
      {children}
    </Column>
  );
}

export function MobileCardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Column gap="1">
      <Text size="2" weight="bold" color="muted">
        {label}
      </Text>
      {children}
    </Column>
  );
}

export function MobileCardRow({ children }: { children: ReactNode }) {
  return (
    <Row alignItems="center" justifyContent="space-between">
      {children}
    </Row>
  );
}
