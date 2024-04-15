"use client";
import React, { useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TraceSpinner } from "react-spinners-kit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMst } from "@/store/model";
import { observer } from "mobx-react-lite";
const BASE_URL = process.env.OPEN_DATA_BASE_API ?? "";
const AutoCompleteSearch = observer(() => {
  const [openAutoComplete, setOpenAutoComplete] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();
  const { country } = useMst();
  const toggleAutoComplete = () => {
    if (!openAutoComplete) inputRef.current?.focus();
    setOpenAutoComplete(!openAutoComplete);
  };
  const handleNavigation = (
    name: string,
    lat: number,
    lon: number,
    country: string,
    timezone: string,
    id: number
  ) => {
    router.push(
      `/weather?city=${name}&lat=${lat}&lon=${lon}&country=${country}&timezone=${timezone}&id=${id}`
    );
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useQuery<
    {
      name: string;
      id: number;
      coordinates: { lat: number; lon: number };
      cou_name_en: string;
      timezone: string;
    }[]
  >({
    queryKey: ["search", debounceSearchTerm],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}?where=cou_name_en%20like%20"${country}"%20and%20search(name%2C"${debounceSearchTerm}")&limit=20`
        );
        return response.data.results.map((city: any) => ({
          name: city.name,
          id: city.geoname_id,
          coordinates: {
            lat: city.coordinates.lat,
            lon: city.coordinates.lon,
          },
          cou_name_en: city.cou_name_en,
          timezone: city.timezone,
        }));
      } catch (error) {
        return [];
      }
    },
    staleTime: 1000,
    enabled: !!debounceSearchTerm,
  });
  return (
    <div
      onFocus={toggleAutoComplete}
      onBlur={toggleAutoComplete}
      tabIndex={0}
      className="relative w-full  md:w-auto z-50"
    >
      <div
        className={`
            flex border px-3 py-2  ${
              openAutoComplete
                ? " rounded-t-md shadow-md"
                : "border-neutral-300 rounded-md"
            }  items-center
            justify-between bg-white
            `}
      >
        <input
          ref={inputRef}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none bg-transparent  sm:w-[95%] md:w-96 "
          placeholder="Search city after selecting a country"
        />
        {isLoading ? (
          <TraceSpinner size={20} />
        ) : (
          <IoSearchSharp className="text-slate-500" />
        )}
      </div>
      <div
        id="auto-complete"
        className={`absolute top-[41px] shadow-md bg-white z-20   border rounded-b-md  max-h-[400px] overflow-auto  w-full  ${
          openAutoComplete ? "block" : "hidden"
        } font-Inter`}
      >
        {data == undefined ? (
          <div className="flex items-center [&:not(:first-child)]:border-t transition-all duration-200   justify-between text-slate-700  px-2 py-3 hover:bg-gray-100 cursor-pointer focus:bg-gray-100">
            <p className="text-sm text-center w-full">
              Results will show up here!
            </p>
          </div>
        ) : data?.length == 0 ? (
          <div className="flex items-center [&:not(:first-child)]:border-t transition-all duration-200   justify-between text-slate-700  px-2 py-3 hover:bg-gray-100 cursor-pointer focus:bg-gray-100">
            <p className="text-sm">No results found!</p>
          </div>
        ) : (
          <></>
        )}
        {data?.map((city) => (
          <div
            onClick={() => {
              handleNavigation(
                city.name,
                city.coordinates.lat,
                city.coordinates.lon,
                city.cou_name_en,
                city.timezone,
                city.id
              );
            }}
            key={city.name}
            className="flex items-center [&:not(:first-child)]:border-t transition-all duration-200   justify-between text-slate-700  px-2 py-3 hover:bg-gray-100 cursor-pointer focus:bg-gray-100"
          >
            <p className="text-sm">{city.name}</p>
            <IoOpenOutline className="text-lg" />
          </div>
        ))}
      </div>
    </div>
  );
});
export default AutoCompleteSearch;
