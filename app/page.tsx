import { TableProvider } from "./components/table/Context";
import Table from "./components/table/Table";
import Filter from "./components/table/Filter";
import CustomMapSection from "./components/Map";
import Paging from "./components/table/Paging";

export default function Home() {
  return (
    <TableProvider>
      <div className="grid grid-cols-12 gap-8 min-h-screen p-8 sm:p-20">
        {/* Left Column: Map */}
        <div className="flex flex-col col-span-6 md:col-span-5 items-center justify-center border border-gray-300 rounded-md p-4">
          <CustomMapSection />
        </div>

        {/* Right Column: Table and Filter */}
        <div className="flex flex-col gap-8 col-span-6 md:col-span-7">
          <Filter />
          <div className="overflow-x-auto">
            <Table />
          </div>
          <Paging />
        </div>
      </div>
    </TableProvider>
  );
}
