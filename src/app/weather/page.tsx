import { useSearchParams } from "next/navigation";
import React from "react";
import Search from "@/components/Search/Search";
import { FiveDayForcast, Weather, WeatherData } from "@/types/types";
import ShowTime from "@/components/Weather/ShowTime";
const OPEN_WEATHER_BASE_API = process.env.OPEN_WEATHER_BASE_API;
const OPEN_WEATHER_APPID = process.env.OPEN_WEATHER_APPID;
import { LiaCloudSolid } from "react-icons/lia";
import { TbWindmill } from "react-icons/tb";
import { WiSunrise } from "react-icons/wi";
import { TbSunset2 } from "react-icons/tb";
import ThunderBg from "@/components/Weather/ThunderBg";
import { convertUnixTimeToDateTime } from "@/utils";
import Footer from "@/components/Footer/Footer";
import CloudBg from "@/components/Weather/CloudBg";
import ClearBg from "@/components/Weather/ClearBg";
import HazeBg from "@/components/Weather/HazeBg";
import RainBg from "@/components/Weather/Rain";
import DrizzleBg from "@/components/Weather/DrizzleBg";
import AtmosphereBg from "@/components/Weather/Atmosphere";
import SnowBg from "@/components/Weather/SnowBg";
import Bookmark from "@/components/Weather/Bookmark";
import AddHistory from "@/components/Weather/AddHistory";
import ShowSunRiseSet from "@/components/Weather/ShowSunRiseSet";
async function getData(lat: string, lon: string) {
  if (!lat || !lon) return {};
  const res = await fetch(
    `${OPEN_WEATHER_BASE_API}/weather?lat=${lat}&lon=${lon}&APPID=${OPEN_WEATHER_APPID}&units=metric`
  );
  if (res.ok) {
    return res.json();
  }
  return {};
}
async function getFiveDaysForcation(lat: string, lon: string) {
  if (!lat || !lon) return {};
  const res = await fetch(
    `${OPEN_WEATHER_BASE_API}/forecast?lat=${lat}&lon=${lon}&APPID=${OPEN_WEATHER_APPID}&units=metric`
  );
  if (res.ok) {
    return res.json();
  }
  return {};
}
const obj = {
  Clouds: <CloudBg />,
  Thunderstorm: <ThunderBg />,
  Clear: <ClearBg />,
  Haze: <HazeBg />,
  Rain: <RainBg />,
  Drizzle: <DrizzleBg />,
  Snow: <SnowBg />,
};
export default async function Page({ searchParams }: any) {
  const { lat, lon, city, country, timezone, id } = searchParams;
  const data: WeatherData = await getData(searchParams.lat, searchParams.lon);
  const fiveDaysForcat: FiveDayForcast = await getFiveDaysForcation(
    searchParams.lat,
    searchParams.lon
  );
  return (
    <section className="relative">
      {obj[data.weather[0].main as keyof typeof obj] || <AtmosphereBg />}
      <main className="flex flex-col flex-grow container mx-auto">
        <AddHistory
          id={id}
          lat={lat}
          lon={lon}
          city={city}
          country={country}
          timezone={timezone}
        />
        <Search />
        <Bookmark
          city={city}
          country={country}
          timezone={timezone}
          lat={lat}
          lon={lon}
          id={id}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
          <div className="shadow-md bg-white text-[rgb(244,245,246)] glass-morph-card rounded-sm p-3 self-start">
            <div className="flex justify-between ">
              <div className="space-y-2">
                <p className="text-sm font-semibold ">{city}</p>
                <p className="text-sm  ">{country}</p>
                <div className="text-sm flex gap-2 flex-wrap">
                  <p className="border border-slate-400 p-1   rounded-md">
                    <span>Latitude:</span>
                    <span> {lat}</span>
                  </p>
                  <p className="border border-slate-400 p-1   rounded-md">
                    <span>Longitude:</span>
                    <span> {lon}</span>
                  </p>
                </div>
              </div>

              <div className="flex w-[200px] flex-col gap-1 items-end">
                <p className="text-sm ">{timezone}</p>
                <div className="flex items-center justify-center">
                  <ShowTime />
                </div>
                <span className="text-sm  flex items-center  ">
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="weather-logo"
                    className="h-12 w-12 rounded-full"
                  />
                  {data.weather[0].main}
                </span>
              </div>
            </div>
          </div>
          <div className="glass-morph-card text-[rgb(244,245,246)] rounded-sm p-3 ">
            <div className="flex  justify-between flex-wrap gap-y-1">
              <div>
                <p className="text-lg  font-semibold">{data.main.temp} °C</p>
                <div className="flex items-center -mt-2 ">
                  <p className="text-sm  -mr-1">
                    {data.weather[0].description}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="weather-logo"
                    className="h-12 w-12 rounded-full"
                  />
                </div>
              </div>
              <ShowSunRiseSet
                sunrise_timestamp={data.sys.sunrise}
                sunset_timestamp={data.sys.sunset}
              />
              <div className="space-y-2">
                <p className="flex items-center gap-2 ">
                  <LiaCloudSolid className="text-3xl " />
                  {data.clouds.all}
                </p>
                <p className="flex  gap-2">
                  <TbWindmill className="text-3xl" />
                  <span className="font-semibold">
                    {Math.ceil(data.wind.speed * 3.6)} KM/H
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="my-5 text-[rgb(244,245,246)] font-semibold">
          Five days forcast!
        </p>
        <div className="flex flex-wrap justify-between gap-2 ">
          {fiveDaysForcat.list.map((forcast) => (
            <div
              className="glass-morph-card w-full sm:w-[48%] md:w-56 text-[rgb(244,245,246)] p-2"
              key={forcast.dt}
            >
              <div className="">
                <p className="text-sm font-semibold ">
                  {convertUnixTimeToDateTime(forcast.dt)}
                </p>
                <p className="text-sm flex items-center gap-1 -mt-2">
                  {forcast.weather[0].main}
                  <img
                    src={`https://openweathermap.org/img/wn/${forcast.weather[0].icon}@2x.png`}
                    alt="weather-logo"
                    className="h-12 w-12 rounded-full"
                  />
                </p>
                <p className="font-semibold -mt-1">{forcast.main.temp} °C</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </section>
  );
}
