import { Button, Icon, ListItem, Row, Select, Text } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { ChevronRight } from '@/components/icons';

export interface PagerProps {
  page: string | number;
  pageSize: string | number;
  count: string | number;
  isCapped?: boolean;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pager({
  page,
  pageSize,
  count,
  isCapped,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}: PagerProps) {
  const { t, labels } = useMessages();
  const maxPage = +pageSize > 0 && count ? Math.ceil(+count / +pageSize) : 0;
  const lastPage = page === maxPage;
  const firstPage = page === 1;
  const showNavigation = maxPage > 1 || isCapped;

  if (count === 0 || (!maxPage && !pageSizeOptions)) {
    return null;
  }

  const handlePageChange = (value: number) => {
    const nextPage = +page + +value;

    if (nextPage > 0 && nextPage <= maxPage) {
      onPageChange(nextPage);
    }
  };

  if (!showNavigation && !pageSizeOptions) {
    return null;
  }

  const displayCount = isCapped ? `10,000+` : (+count).toLocaleString();

  return (
    <Row alignItems="center" justifyContent="space-between" gap="3" flexGrow={1} wrap="wrap">
      <Text color="muted">{t(labels.numberOfRecords, { x: displayCount })}</Text>
      <Row
        alignItems="center"
        justifyContent="flex-end"
        gap="3"
        wrap="nowrap"
        style={{ whiteSpace: 'nowrap' }}
      >
        {pageSizeOptions && onPageSizeChange && (
          <Row alignItems="center" gap="2">
            <Text color="muted">Show</Text>
            <Select
              value={String(pageSize)}
              onChange={(value: string) => onPageSizeChange(Number(value))}
              buttonProps={{ style: { minHeight: '32px', minWidth: '70px' } }}
            >
              {pageSizeOptions.map(size => (
                <ListItem key={String(size)} id={String(size)}>
                  {size === 0 ? 'All' : String(size)}
                </ListItem>
              ))}
            </Select>
          </Row>
        )}
        {showNavigation && (
          <>
            <Text color="muted">
              {t(labels.pageOf, {
                current: page.toLocaleString(),
                total: maxPage.toLocaleString(),
              })}
            </Text>
            <Row gap="1">
              <Button variant="outline" onPress={() => handlePageChange(-1)} isDisabled={firstPage}>
                <Icon size="sm" rotate={180}>
                  <ChevronRight />
                </Icon>
              </Button>
              <Button variant="outline" onPress={() => handlePageChange(1)} isDisabled={lastPage}>
                <Icon size="sm">
                  <ChevronRight />
                </Icon>
              </Button>
            </Row>
          </>
        )}
      </Row>
    </Row>
  );
}
