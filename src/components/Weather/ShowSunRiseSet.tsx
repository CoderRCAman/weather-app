"use client";

import { TbSunset2 } from "react-icons/tb";
import { WiSunrise } from "react-icons/wi";

export default function ShowSunRiseSet({
  sunrise_timestamp,
  sunset_timestamp,
}: {
  sunrise_timestamp: number;
  sunset_timestamp: number;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2">
        <WiSunrise className="text-red-400 text-3xl" />
        <span className="text-sm  ">
          {new Date(sunrise_timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Use 12-hour clock format)}
          })}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <TbSunset2 className="text-red-500 text-3xl " />
        <span className="text-sm ">
          {new Date(sunset_timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Use 12-hour clock format)}
          })}
        </span>
      </p>
    </div>
  );
}
