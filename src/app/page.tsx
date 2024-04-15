import Footer from "@/components/Footer/Footer";
import Search from "@/components/Search/Search";
import MobileTable from "@/components/Table/MobileTable";
import Table from "@/components/Table/Table";
import RenderTableOrCard from "./weather/RenderTableOrCard";

export default function Home() {
  return (
    <main className="flex flex-col flex-grow container mx-auto">
      <Search />

      <RenderTableOrCard />
      <Footer />
    </main>
  );
}
