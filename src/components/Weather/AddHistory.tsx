"use client";
import useHistory from "@/hooks/useHistory";
import React from "react";

export default function AddHistory({
  lat,
  lon,
  city,
  country,
  timezone,
  id,
}: {
  lat: string;
  lon: string;
  city: string;
  country: string;
  timezone: string;
  id: string;
}) {
  useHistory({ lat, lon, city, country, timezone, id });
  return <></>;
}
