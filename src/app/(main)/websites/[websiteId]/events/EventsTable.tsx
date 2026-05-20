import {
  Button,
  Column,
  DataColumn,
  DataTable,
  type DataTableProps,
  Dialog,
  DialogTrigger,
  Icon,
  Popover,
  Row,
  Text,
} from '@umami/react-zen';
import Link from '@/components/common/Link';
import { Avatar } from '@/components/common/Avatar';
import { DateDistance } from '@/components/common/DateDistance';
import { IconLabel } from '@/components/common/IconLabel';
import { MobileCard, MobileCardField, MobileCardRow } from '@/components/common/MobileCard';
import { TypeIcon } from '@/components/common/TypeIcon';
import { useFormat, useMessages, useMobile, useNavigation } from '@/components/hooks';
import { Eye, FileText } from '@/components/icons';
import { EventData } from '@/components/metrics/EventData';
import { Lightning } from '@/components/svg';

function EventMobileCard({ row }: { row: any }) {
  const { t, labels } = useMessages();
  const { formatValue } = useFormat();
  const { updateParams } = useNavigation();

  return (
    <MobileCard>
      <MobileCardField label={t(labels.event)}>
        <Row alignItems="center" wrap="wrap" gap>
          <IconLabel
            icon={row.eventName ? <Lightning /> : <Eye />}
            label={t(row.eventName ? labels.triggeredEvent : labels.viewedPage)}
          />
          <Text weight="bold" style={{ wordBreak: 'break-all' }}>
            {row.eventName || row.urlPath}
          </Text>
          {row.hasData > 0 && <PropertiesButton websiteId={row.websiteId} eventId={row.id} />}
        </Row>
      </MobileCardField>
      <MobileCardRow>
        <Link href={updateParams({ session: row.sessionId })}>
          <Avatar seed={row.sessionId} size={32} />
        </Link>
        <TypeIcon type="country" value={row.country}>
          {row.city ? `${row.city}, ` : ''}
          {formatValue(row.country, 'country')}
        </TypeIcon>
      </MobileCardRow>
      <MobileCardRow>
        <TypeIcon type="browser" value={row.browser}>
          {formatValue(row.browser, 'browser')}
        </TypeIcon>
        <TypeIcon type="device" value={row.device}>
          {formatValue(row.device, 'device')}
        </TypeIcon>
      </MobileCardRow>
      <MobileCardRow>
        <Text size="sm" color="muted">
          <DateDistance date={new Date(row.createdAt)} />
        </Text>
        <div />
      </MobileCardRow>
    </MobileCard>
  );
}

export function EventsTable(props: DataTableProps) {
  const { t, labels } = useMessages();
  const { updateParams } = useNavigation();
  const { formatValue } = useFormat();
  const { isMobile } = useMobile();

  if (isMobile && props.data) {
    return (
      <Column gap="4">
        {props.data.map((row: any, i: number) => (
          <EventMobileCard key={row.id || i} row={row} />
        ))}
      </Column>
    );
  }

  const renderLink = (label: string, hostname: string) => {
    return (
      <a
        href={`//${hostname}${label}`}
        style={{ fontWeight: 'bold' }}
        target="_blank"
        rel="noreferrer noopener"
      >
        {label}
      </a>
    );
  };

  return (
    <DataTable {...props}>
      <DataColumn id="event" label={t(labels.event)} width="2fr">
        {(row: any) => {
          return (
            <Row alignItems="center" wrap="wrap" gap>
              <Row>
                <IconLabel
                  icon={row.eventName ? <Lightning /> : <Eye />}
                  label={t(row.eventName ? labels.triggeredEvent : labels.viewedPage)}
                />
              </Row>
              <Text
                weight="bold"
                style={{ maxWidth: '300px' }}
                title={row.eventName || row.urlPath}
                truncate
              >
                {row.eventName || renderLink(row.urlPath, row.hostname)}
              </Text>
              {row.hasData > 0 && <PropertiesButton websiteId={row.websiteId} eventId={row.id} />}
            </Row>
          );
        }}
      </DataColumn>
      <DataColumn id="session" label={t(labels.session)} width="80px">
        {(row: any) => {
          return (
            <Link href={updateParams({ session: row.sessionId })}>
              <Avatar seed={row.sessionId} size={32} />
            </Link>
          );
        }}
      </DataColumn>
      <DataColumn id="location" label={t(labels.location)}>
        {(row: any) => (
          <TypeIcon type="country" value={row.country}>
            {row.city ? `${row.city}, ` : ''} {formatValue(row.country, 'country')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="browser" label={t(labels.browser)} width="140px">
        {(row: any) => (
          <TypeIcon type="browser" value={row.browser}>
            {formatValue(row.browser, 'browser')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="device" label={t(labels.device)} width="140px">
        {(row: any) => (
          <TypeIcon type="device" value={row.device}>
            {formatValue(row.device, 'device')}
          </TypeIcon>
        )}
      </DataColumn>
      <DataColumn id="created" width="140px" label={t(labels.created)}>
        {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
      </DataColumn>
    </DataTable>
  );
}

const PropertiesButton = props => {
  return (
    <DialogTrigger>
      <Button variant="quiet">
        <Row alignItems="center" gap>
          <Icon>
            <FileText />
          </Icon>
        </Row>
      </Button>
      <Popover placement="right">
        <Dialog>
          <EventData {...props} />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
