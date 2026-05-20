import { Button, Icon, ListItem, Row, Select, Text } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { ChevronRight } from '@/components/icons';

export interface PagerProps {
  page: string | number;
  pageSize: string | number;
  count: string | number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pager({
  page,
  pageSize,
  count,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}: PagerProps) {
  const { t, labels } = useMessages();
  const maxPage = +pageSize > 0 && count ? Math.ceil(+count / +pageSize) : 0;
  const lastPage = page === maxPage;
  const firstPage = page === 1;

  if (count === 0 || (!maxPage && !pageSizeOptions)) {
    return null;
  }

  const handlePageChange = (value: number) => {
    const nextPage = +page + +value;

    if (nextPage > 0 && nextPage <= maxPage) {
      onPageChange(nextPage);
    }
  };

  if (maxPage === 1 && !pageSizeOptions) {
    return null;
  }

  return (
    <Row alignItems="center" justifyContent="space-between" gap="3" flexGrow={1}>
      <Text>{t(labels.numberOfRecords, { x: count.toLocaleString() })}</Text>
      <Row alignItems="center" justifyContent="flex-end" gap="3">
        {pageSizeOptions && onPageSizeChange && (
          <Row alignItems="center" gap="2">
            <Text>Show</Text>
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
        {maxPage > 1 && (
          <>
            <Text>
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
