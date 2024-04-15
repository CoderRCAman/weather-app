"use client";
import React from "react";
import { Provider, RootStore } from "./model";

export default function MSTProvider({ children }: any) {
  return <Provider value={RootStore}>{children}</Provider>;
}
