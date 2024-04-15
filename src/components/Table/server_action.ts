"use server";

import { metadata } from "@/app/layout";
import { City } from "@/types/types";
import { ColumnSort, SortingState } from "@tanstack/react-table";
import axios from "axios";
const BASE_URL = process.env.OPEN_DATA_BASE_API ?? "";
export async function fetchData(
  start: number,
  size: number,
  sorting: SortingState,
  country: string = "India"
) {
  try {
    let response: any;
    if (sorting.length) {
      const sort = sorting[0] as ColumnSort;
      const { id, desc } = sort as { id: keyof City; desc: boolean };
      if (desc) {
        //make an API call in desc order
        response = await axios.get(
          `${BASE_URL}?where=cou_name_en%20like%20"${country}"&order_by=${id}%20desc&limit=${size}&offset=${start}`
        );
      } else {
        //default
        response = await axios.get(
          `${BASE_URL}?where=cou_name_en%20like%20"${country}"&order_by=${id}%20asc&limit=${size}&offset=${start}`
        );
      }
    } else {
      response = await axios.get(
        `${BASE_URL}?where=cou_name_en%20like%20"${country}"&limit=${size}&offset=${start}`
      );
    } 
   
    return {
      meta: {
        totalRowCount: response.data.total_count,
      },
      data: response.data.results.map((city: any) => ({
        geoname_id: city.geoname_id,
        name: city.name,
        cou_name_en: city.cou_name_en,
        population: city.population,
        timezone: city.timezone,
        lat: city.coordinates.lat,
        lon: city.coordinates.lon,
      })),
    };
  } catch (error) {
    return {
      meta: {
        totalRowCount: 0,
      },
      data: [],
    };
  }
}
