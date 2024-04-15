import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Provider, RootStore } from "@/store/model";
import MSTProvider from "@/store/MSTProvider";
import RQProvider from "@/store/RQProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather App",
  description: "For an assignment by STAMURAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col flex-grow min-h-screen">
        <RQProvider>
          <MSTProvider>
            <Navbar />
            {children}
          </MSTProvider>
        </RQProvider>
      </body>
    </html>
  );
}
