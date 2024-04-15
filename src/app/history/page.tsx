"use client";
import Search from "@/components/Search/Search";
import { useMst } from "@/store/model";
import { DeleteIcon } from "lucide-react";
import React from "react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
export default observer(function History() {
  const { history, clearHistory } = useMst();
  return (
    <section className="flex flex-col flex-grow container mx-auto">
      <Search />
      <div className="">
        {history.length > 0 && (
          <div className="flex items-center justify-between">
            <h1 className=" my-5 text-md font-semibold text-slate-500">
              Your History
            </h1>
            <button
              onClick={() =>
                window.confirm("Are you sure?") ? clearHistory() : null
              }
              className="text-red-500 border-red-500 gap-2 border flex items-center rounded-md px-4 py-2"
            >
              <DeleteIcon /> Clear
            </button>
          </div>
        )}
        <div className="space-y-1">
          {history
            .map((bookmark) => bookmark)
            .reverse()
            .map((bookmark) => (
              <div
                key={bookmark.id}
                className="shadow-sm p-3 flex justify-between flex-wrap border rounded-md border-gray-100"
              >
                <div>
                  <Link
                    href={`/weather?city=${bookmark.city}&lat=${bookmark.lat}&lon=${bookmark.lon}&country=${bookmark.country}&timezone=${bookmark.timezone}&id=${bookmark.id}`}
                  >
                    <p className="font-semibold text-slate-400">
                      {bookmark.city}
                    </p>
                  </Link>
                  <p className="text-sm text-slate-400">{bookmark.country}</p>
                </div>
                <div className="text-sm font-semibold text-slate-400">
                  <p>Lat: {bookmark.lat}</p>
                  <p>Lon: {bookmark.lon}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-slate-400">
                  {bookmark.timezone}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {history.length == 0 && (
          <p className="text-center mt-20 text-slate-400 font-semibold">
            {" "}
            NO HISTORY TO SHOW START VISITING CITIES!
          </p>
        )}
      </div>
    </section>
  );
});
