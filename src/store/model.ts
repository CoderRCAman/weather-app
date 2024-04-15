import Bookmark from "@/components/Weather/Bookmark";
import { types, Instance, onSnapshot, onPatch, destroy } from "mobx-state-tree";
import { createContext, useContext } from "react";
const City = types.model({
  id: types.optional(types.number, 0),
  name: types.optional(types.string, ""),
  country_name: types.optional(types.string, ""),
  population: types.optional(types.number, 0),
  time_zone: types.optional(types.string, ""),
});
const Location = types
  .model({
    city: types.optional(types.string, ""),
    lat: types.optional(types.string, ""),
    lon: types.optional(types.string, ""),
    country: types.optional(types.string, ""),
    timezone: types.optional(types.string, ""),
    id: types.optional(types.string, ""),
  })
  .actions((self) => ({
    remove() {
      destroy(self);
    },
  }));

const RootModel = types
  .model({
    total_table_result: types.optional(types.number, 0),
    cities: types.optional(types.array(City), []),
    country: types.optional(types.string, "India"),
    history: types.optional(types.array(Location), []),
    bookmarks: types.optional(types.array(Location), []),
  })
  .actions((self) => ({
    set_city(city: string) {
      self.country = city;
    },
    addToHistory({
      city,
      lat,
      lon,
      country,
      timezone,
      id,
    }: {
      city: string;
      lat: string;
      lon: string;
      country: string;
      timezone: string;
      id: string;
    }) {
      self.history.push(
        Location.create({
          city,
          lat,
          lon,
          country,
          timezone,
          id,
        })
      );
      const localBookmarks = localStorage.getItem("history");
      if (localBookmarks) {
        const arrBookmarks: any[] = JSON.parse(localBookmarks);
        arrBookmarks.push({ id, city, lat, lon, country, timezone });
        localStorage.setItem("history", JSON.stringify(arrBookmarks));
      } else {
        //add new here
        const newArr = [{ id, city, lat, lon, country, timezone }];
        localStorage.setItem("history", JSON.stringify(newArr));
      }
    },
    addBookmark({
      city,
      lat,
      lon,
      country,
      timezone,
      id,
    }: {
      city: string;
      lat: string;
      lon: string;
      country: string;
      timezone: string;
      id: string;
    }) {
      self.bookmarks.push(
        Location.create({ city, lat, lon, country, timezone, id })
      );
      const localBookmarks = localStorage.getItem("bookmarks");

      if (localBookmarks) {
        const arrBookmarks: any[] = JSON.parse(localBookmarks);
        const newArr = [
          ...arrBookmarks,
          { id, city, lat, lon, country, timezone },
        ];
        localStorage.setItem("bookmarks", JSON.stringify(newArr));
      } else {
        //add new here
        const newArr = [{ id, lat, lon, city, country, timezone }];
        localStorage.setItem("bookmarks", JSON.stringify(newArr));
      }
    },
    clearHistory() {
      destroy(self.history);
      localStorage.setItem("history", JSON.stringify([]));
    },
    removeBookmark(id: string) {
      self.bookmarks.forEach(
        (bookmark) => id == bookmark.id && bookmark.remove()
      );
      const localBookmarks = localStorage.getItem("bookmarks");
      if (localBookmarks) {
        let arrBookmarks: any[] = JSON.parse(localBookmarks);
        arrBookmarks = arrBookmarks.filter((bookmark) => bookmark.id != id);
        localStorage.setItem("bookmarks", JSON.stringify(arrBookmarks));
      }
    },
    existBookmark(id: string) {
      return self.bookmarks.find((Bookmark) => Bookmark.id == id);
    },
  }));

const initial_store = RootModel.create({
  cities: [],
  country: "India",
  bookmarks:
    typeof window !== "undefined" && localStorage.getItem("bookmarks")
      ? JSON.parse(localStorage.getItem("bookmarks")!)
      : [],
  history:
    typeof window !== "undefined" && localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history")!)
      : [],
});

export const RootStore = initial_store;
export type RootInstance = Instance<typeof RootStore>;
export type CityInstance = Instance<typeof City>;
export const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
