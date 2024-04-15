"use client";
import { useInterval } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
export default function ShowTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clear = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => {
      clearInterval(clear);
    };
  }, []);
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour clock format
  });
  return <div className="text-slate-500 bg-slate-100 text-center rounded-md p-1 text-sm">{formattedTime}</div>;
}
