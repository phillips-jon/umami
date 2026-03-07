import type { UseQueryResult } from '@tanstack/react-query';
import { Column, Row, SearchField } from '@umami/react-zen';
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import { Empty } from '@/components/common/Empty';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Pager } from '@/components/common/Pager';
import { useMessages, useMobile, useNavigation } from '@/components/hooks';
import type { PageResult } from '@/lib/types';

const DEFAULT_SEARCH_DELAY = 600;

export interface DataGridProps {
  query: UseQueryResult<PageResult<any>, any>;
  searchDelay?: number;
  allowSearch?: boolean;
  allowPaging?: boolean;
  autoFocus?: boolean;
  pageSizeOptions?: number[];
  renderActions?: () => ReactNode;
  renderEmpty?: () => ReactNode;
  children: ReactNode | ((data: any) => ReactNode);
}

export function DataGrid({
  query,
  searchDelay = 600,
  allowSearch,
  allowPaging = true,
  autoFocus,
  pageSizeOptions,
  renderActions,
  renderEmpty = () => <Empty />,
  children,
}: DataGridProps) {
  const { formatMessage, labels } = useMessages();
  const { data, error, isLoading, isFetching } = query;
  const { router, updateParams, query: queryParams } = useNavigation();
  const [search, setSearch] = useState(queryParams?.search || data?.search || '');
  const showPager = allowPaging && data && (data.count > data.pageSize || pageSizeOptions);
  const { isMobile } = useMobile();
  const displayMode = isMobile ? 'cards' : undefined;

  const handleSearch = (value: string) => {
    if (value !== search) {
      setSearch(value);
      router.push(updateParams({ search: value, page: 1 }));
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(updateParams({ search, page, pageSize: queryParams?.pageSize }));
    },
    [search, queryParams?.pageSize],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      router.push(updateParams({ search, page: 1, pageSize }));
    },
    [search],
  );

  const child = data ? (typeof children === 'function' ? children(data) : children) : null;

  return (
    <Column gap="4" minHeight="300px">
      {allowSearch && (
        <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap>
          <Row alignItems="center" gap>
            <SearchField
              value={search}
              onSearch={handleSearch}
              delay={searchDelay || DEFAULT_SEARCH_DELAY}
              autoFocus={autoFocus}
              placeholder={formatMessage(labels.search)}
            />
            {renderActions?.()}
          </Row>
        </Row>
      )}
      <LoadingPanel
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        renderEmpty={renderEmpty}
      >
        {data && (
          <>
            <Column>
              {isValidElement(child)
                ? cloneElement(child as ReactElement<any>, { displayMode })
                : child}
            </Column>
            {showPager && (
              <Row marginTop="6">
                <Pager
                  page={data.page}
                  pageSize={
                    pageSizeOptions && queryParams?.pageSize != null
                      ? queryParams.pageSize
                      : data.pageSize
                  }
                  count={data.count}
                  onPageChange={handlePageChange}
                  onPageSizeChange={pageSizeOptions ? handlePageSizeChange : undefined}
                  pageSizeOptions={pageSizeOptions}
                />
              </Row>
            )}
          </>
        )}
      </LoadingPanel>
    </Column>
  );
}
