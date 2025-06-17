import { TableProvider } from './components/table/Context';
import Table from './components/table/Table';
import CustomMapSection from './components/map/Map';
import { DataProvider } from './components/map/DataProvider';
import Filter from './components/Filter';
import Select from './components/Select';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { wirtschaftszweig, stoffgruppe, show } = await searchParams;
  // Get data from the API
  const queryParams = new URLSearchParams();
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
    const url = `${API_BASE_URL}/api/data?${queryParams.toString()}`;
    console.log('Fetching data from:', url);
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await response.json();
    data = json.map((item: any) => ({
      Jahr: parseInt(item['Jahr'], 10),
      Bundesland: item['Bundesland'],
      Kennzahl: item['Kennzahl'],
      Wirtschaftszweig: item['Wirtschaftszweig'],
      Stoffgruppe: item['Stoffgruppe'],
      Verwendung: parseFloat(item['Verwendung(t)']),
      VerwendungCO2: parseFloat(item['VerwendungCO2(1000t)']),
      Einfuhr: parseFloat(item['Einfuhr(t)']),
      EinfuhrCO2: parseFloat(item['EinfuhrCO2(1000t)']),
      Ausfuhr: parseFloat(item['Ausfuhr(t)']),
      AusfuhrCO2: parseFloat(item['AusfuhrCO2(1000t)']),
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return (
    <TableProvider>
      <div className="grid grid-cols-12 gap-8 sm:p-8 grow">
        {/* Left Column: Map */}
        <div className="box-border flex flex-col col-span-6 md:col-span-5 items-center justify-center border border-gray-300 rounded-md p-4">
          <DataProvider
            pollutionData={data}
            wirtschaftszweig={wirtschaftszweig}
            stoffgruppe={stoffgruppe}
            show={show}
          />
        </div>

        {/* Right Column: Table and Filter */}
        <div className="flex flex-col gap-8 col-span-6 md:col-span-7 h-full overflow-y-auto">
          <Filter />
          <Select />
          <div className="overflow-x-auto">
            <Table
              tableData={data}
              tableHeader={{
                Jahr: 'Jahr',
                Bundesland: 'Bundesland',
                Kennzahl: 'Kennzahl',
                Wirtschaftszweig: 'Wirtschaftszweig',
                Stoffgruppe: 'Stoffgruppe',
                Verwendung: 'Verwendung(t)',
                VerwendungCO2: 'VerwendungCO2(1000t)',
                Einfuhr: 'Einfuhr(t)',
                EinfuhrCO2: 'EinfuhrCO2(1000t)',
                Ausfuhr: 'Ausfuhr(t)',
                AusfuhrCO2: 'AusfuhrCO2(1000t)',
              }}
            />
          </div>
        </div>
      </div>
    </TableProvider>
  );
}
