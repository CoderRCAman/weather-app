"use client";
import React from "react";
import AutoCompleteSearch from "./AutoCompleteSearch";
import country from "@/data/country.json";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { observer } from "mobx-react-lite";
import { useMst } from "@/store/model";
const Search = observer(() => {
  const store = useMst();

  return (
    <div className="flex w-full  flex-col md:flex-row justify-between items-center gap-2 my-5">
      <AutoCompleteSearch />
      <div className="flex items-center justify-end w-full md:w-a uto gap-2">
        <Select defaultValue={store.country} onValueChange={store.set_city}>
          <SelectTrigger className="md:max-w-[220px]  w-full  border-neutral-300 ring-offset-0 focus:ring-0 focus:ring-offset-0 ">
            <SelectValue placeholder="By a county" />
          </SelectTrigger>
          <SelectContent onClick={(e) => e.stopPropagation()} className="">
            {country.map((data, index) => (
              <SelectItem key={index} value={data.name}>
                {data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});
export default Search;
