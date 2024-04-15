"use client";
import React, { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

//3 TanStack Libraries!!!
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import { City, OpenDataSoftAPIResponse } from "@/types/types";
import { useMst } from "@/store/model";
import { observer } from "mobx-react-lite";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "./server_action";
import Link from "next/link";
import { ImpulseSpinner, StageSpinner } from "react-spinners-kit";

const fetchSize = 50;

const Table = observer(() => {
  const store = useMst();
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { country } = store;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = React.useMemo<ColumnDef<City>[]>(
    () => [
      {
        accessorKey: "geoname_id",
        header: "Id",
        size: 16,
      },

      {
        accessorKey: "name",
        header: () => "Name",
        size: 20,
      },
      {
        accessorKey: "cou_name_en",
        header: () => <span>Country</span>,
        size: 20,
      },
      {
        accessorKey: "population",
        header: "Population",
        size: 16,
      },
      {
        accessorKey: "lat",
        header: "Latitude",
        size: 16,
      },
      {
        accessorKey: "lon",
        header: "Longitude",
        size: 16,
      },
      {
        accessorKey: "timezone",
        header: "Time Zone",
        size: 16,
      },
    ],
    []
  );

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<OpenDataSoftAPIResponse>({
      queryKey: [
        "desktop-cities",
        sorting, //refetch when sorting changes
        country,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await fetchData(start, fetchSize, sorting, country); //pretend api call
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    // [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
    [isFetching, totalFetched, totalDBRowCount, fetchNextPage] //todo fetchNextPage
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
  });

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">
          Fetching your infinite scrolling data table!
        </span>
        <StageSpinner size={34} color={"#6366f1"} />
      </div>
    );
  }

  return (
    <div className=" mb-5 ">
      <div
        className="overflow-auto rounded-lg shadow hidden md:block w-full"
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        style={{
          height: "800px", //should be a fixed height
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table className="w-full  relative">
          <thead className="bg-gray-50 border-b-2 sticky inset-0 z-20   border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="  w-full" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className={`p-3 text-sm font-semibold tracking-wide text-left`}
                      style={{
                        width: `${header.id == "geoname_id" ? "10%" : "200px"}`,
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none w-full flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <MdKeyboardArrowUp className="text-xl mt-1" />,
                          desc: (
                            <MdKeyboardArrowDown className=" text-xl mt-1" />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className="opacity-0">
                            <MdKeyboardArrowUp className="text-xl" />,
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className="divide-y divide-gray-100"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<City>;
              return (
                <tr
                  className="bg-white"
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: "flex",
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: "100%",
                    zIndex: 10,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <>
                        {cell.column.id == "name" ? (
                          <td
                            className={`p-3  text-sm text-gray-700 whitespace-nowrap truncate  `}
                            key={cell.id}
                            style={{
                              width: "47%",
                            }}
                          >
                            <Link
                              href={`/weather?city=${cell.getValue()}&lat=${
                                cell.row.original.lat
                              }&lon=${cell.row.original.lon}&country=${
                                cell.row.original.cou_name_en
                              }&timezone=${cell.row.original.timezone}&id=${
                                cell.row.original.geoname_id
                              }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Link>
                          </td>
                        ) : (
                          <td
                            className={`p-3   text-sm text-gray-700 whitespace-nowrap truncate  `}
                            key={cell.id}
                            style={{
                              width: `${
                                cell.column.id == "geoname_id" ? "30%" : "47%"
                              }`,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )}
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isFetching && (
        <div className="flex items-center gap-2 mt-2 ml-1 ">
          <span className="text-sm text-slate-500">Fetching More</span>
          <ImpulseSpinner size={35} frontColor={"#6366f1"} />
        </div>
      )}
    </div>
  );
});

export default Table;
