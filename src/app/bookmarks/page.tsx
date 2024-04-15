"use client";
import Footer from "@/components/Footer/Footer";
import Search from "@/components/Search/Search";
import { useMst } from "@/store/model";
import { observer } from "mobx-react-lite";
import Link from "next/link";
export default observer(function Bookmarks() {
  const { bookmarks, removeBookmark } = useMst();
  return (
    <>
      <section className="flex flex-col flex-grow container mx-auto">
        <Search />
        <div>
          {bookmarks.length > 0 && (
            <h1 className="text-center my-5 text-md font-semibold text-slate-500">
              Your Bookmarks
            </h1>
          )}
          <div className="space-y-1">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="shadow-sm p-3 gap-y-2 flex justify-between flex-wrap border rounded-md border-gray-100"
              >
                <div className="w-40">
                  <Link
                    href={`/weather?city=${bookmark.city}&lat=${bookmark.lat}&lon=${bookmark.lon}&country=${bookmark.country}&timezone=${bookmark.timezone}&id=${bookmark.id}`}
                  >
                    <p className="font-semibold text-slate-400">
                      {bookmark.city}
                    </p>
                  </Link>
                  <p className="text-sm text-slate-400">{bookmark.country}</p>
                </div>
                <div className="text-sm  font-semibold text-slate-400">
                  <p>Lat: {bookmark.lat}</p>
                  <p>Lon: {bookmark.lon}</p>
                </div>
                <div className="flex w-40 flex-col sm:items-center items-start gap-2">
                  <p className="text-sm text-slate-400">{bookmark.timezone}</p>
                  <button
                    onClick={() =>
                      window.confirm("Are you sure?")
                        ? removeBookmark(bookmark.id)
                        : null
                    }
                    className="text-red-500 border-red-500 border rounded-md px-4 py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          {bookmarks.length == 0 && (
            <p className="text-center mt-20 text-slate-400 font-semibold">
              {" "}
              NO BOOKMARKS TO SHOW PLEASE ADD NEW BOOKMARKS
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
});
