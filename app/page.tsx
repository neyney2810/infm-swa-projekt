import { TableProvider } from './components/table/Context';
import Table from './components/table/Table';
import CustomMapSection from './components/map/Map';
import Paging from './components/table/Paging';
import { DataProvider } from './components/map/DataProvider';
import Filter from './components/Filter';
import { FilterT } from './types';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { bundesland, wirtschaftszweig, stoffgruppe } = await searchParams;
  // Get data from the API
  const queryParams = new URLSearchParams();
  if (bundesland) {
    queryParams.append('bundesland', bundesland);
  }
  if (wirtschaftszweig) {
    queryParams.append('wirtschaftszweig', wirtschaftszweig);
  }
  if (stoffgruppe) {
    queryParams.append('stoffgruppe', stoffgruppe);
  }

  let data: any[] = [];

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${API_BASE_URL}/api/data?${queryParams.toString()}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await response.json();
    data = json.map((item: any) => ({
      ...item,
      Jahr: parseInt(item.Jahr, 10),
      Verwendung: parseFloat(item.Verwendung),
      VerwendungCO2: parseFloat(item.VerwendungCO2),
      Einfuhr: parseFloat(item.Einfuhr),
      EinfuhrCO2: parseFloat(item.EinfuhrCO2),
      Ausfuhr: parseFloat(item.Ausfuhr),
      AusfuhrCO2: parseFloat(item.AusfuhrCO2),
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return (
    <TableProvider>
      <div className="grid grid-cols-12 gap-8 min-h-screen sm:p-8">
        {/* Left Column: Map */}
        <div className="flex flex-col col-span-6 md:col-span-5 items-center justify-center border border-gray-300 rounded-md p-4">
          <DataProvider pollutionData={data} />
        </div>

        {/* Right Column: Table and Filter */}
        <div className="flex flex-col gap-8 col-span-6 md:col-span-7">
          <Filter stoffgruppe={null} wirtschaftszweig={null} />
          <div className="overflow-x-auto">
            <Table />
          </div>
          <Paging />
        </div>
      </div>
    </TableProvider>
  );
}
