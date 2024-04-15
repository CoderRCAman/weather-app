"use client";
import React from "react";
import { IoBookmarksOutline } from "react-icons/io5";
import { IoBookmarksSharp } from "react-icons/io5";
import { observer } from "mobx-react-lite";
import { useMst } from "@/store/model";
export default observer(function Bookmark({
  city,
  country,
  timezone,
  lat,
  lon,
  id,
}: {
  city: string;
  country: string;
  timezone: string;
  lat: string;
  lon: string;
  id: string;
}) {
  const { addBookmark, bookmarks, removeBookmark } = useMst();
  return (
    <div className="flex justify-end">
      {bookmarks.find((bookmark) => bookmark.id == id) ? (
        <button
          onClick={() => removeBookmark(id)}
          className="glass-morph-card flex px-5 py-2 text-white items-center gap-2"
        >
          <IoBookmarksSharp />
          <span className="font-semibold">Remove</span>
        </button>
      ) : (
        <button
          onClick={() =>
            addBookmark({
              city,
              country,
              timezone,
              lat,
              lon,
              id,
            })
          }
          className="glass-morph-card flex px-5 py-2 text-white items-center gap-2"
        >
          <IoBookmarksOutline />
          <span className="font-semibold">Bookmark</span>
        </button>
      )}
    </div>
  );
});
