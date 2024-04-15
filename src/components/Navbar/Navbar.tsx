import Link from "next/link";
import React from "react";
import { FaHistory } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";
export default function Navbar() {
  return (
    <div className="bg-indigo-600 text-white">
      <nav className="container mx-auto flex justify-between py-4 font-Inter">
        <Link href={"/"}>
          <div className="font-semibold text-xl">
            <img src="/logo.svg" alt="logo" className="h-8" />
          </div>
        </Link>

        <div className="flex text-xl items-center gap-5 ">
          <Link href={"/history"}>
            <FaHistory />
          </Link>
          <Link href={"/bookmarks"}>
            <IoBookmarks />
          </Link>
        </div>
      </nav>
    </div>
  );
}
