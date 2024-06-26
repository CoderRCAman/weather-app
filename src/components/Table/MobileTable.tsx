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

const MobileTable = observer(() => {
  const store = useMst();
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { country } = store;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const {
    data,
    fetchNextPage,
    isFetching,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<OpenDataSoftAPIResponse>({
    queryKey: [
      "mobile-table",
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
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? flatData.length + 1 : flatData.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 170,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">
          Fetching your infinite city data!
        </span>
        <StageSpinner size={34} color={"#6366f1"} />
      </div>
    );
  }

  return (
    <div className=" mb-5 md:hidden ">
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        style={{
          height: `650px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {flatData.length == 0 ? (
            <p className="text-sm text-slate-400 font-semibold text-center">
              No results found!
            </p>
          ) : (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > flatData.length - 1;
              const post = flatData[virtualRow.index];
              return (
                <div
                  key={virtualRow.index}
                  className={
                    virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                  }
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    maxHeight: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                  }}
                >
                  <div className="p-2 flex ">
                    <div className="rounded-md w-full shadow-md  ">
                      <Link
                        className="flex justify-between  p-3 flex-wrap gap-y-2"
                        href={`/weather?city=${post?.name}&lat=${post?.lat}&lon=${post?.lon}&country=${post?.cou_name_en}&timezone=${post?.timezone}&id=${post?.geoname_id}`}
                      >
                        <div className="grid w-full grid-cols-2">
                          <div className=" w-full flex justify-start   rounded-md">
                            <p className="text-sm w-40 text-slate-500 font-semibold">
                              {post?.geoname_id}
                            </p>
                          </div>
                          <div className=" w-full flex justify-end rounded-md">
                            <div className="">
                              <p className="text-sm  text-slate-500 font-semibold">
                                {post?.name}
                              </p>
                              <p className="text-slate-400">
                                {post?.cou_name_en}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full gap-y-1 flex-wrap">
                          <div className="w-40">
                            <p className="text-sm text-slate-400 font-semibold">
                              Lat: {post?.lat}
                            </p>
                            <p className="text-sm text-slate-400 font-semibold">
                              Lon: {post?.lon}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 font-semibold">
                              Timezone: {post?.timezone}
                            </p>
                            <p className="text-sm text-slate-400">
                              Population : {post?.population}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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

export default MobileTable;
