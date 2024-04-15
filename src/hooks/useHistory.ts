"use client";
import { useContext, useEffect } from "react";
import { RootStoreContext } from "@/store/model";
export default function useHistory({
  id,
  city,
  lat,
  lon,
  country,
  timezone,
}: {
  id: string;
  city: string;
  lat: string;
  lon: string;
  country: string;
  timezone: string;
}) {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  useEffect(() => {
    store.addToHistory({ id, city, lat, lon, country, timezone });
  }, []);
}
