'use server';

import { DataUnit, MarkerData } from '@/app/types';
import Map from './Map';

async function fetchMetaData(): Promise<any> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${API_BASE_URL}/api/meta`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch meta data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching meta data:', error);
    return null;
  }
}

type DataProviderProps = {
  pollutionData: DataUnit[];
};

export async function DataProvider({ pollutionData }: DataProviderProps) {
  const metaData = await fetchMetaData();

  // If current

  // Map poluttionData wit metaData and provide it as MarkerData[]
  // const mappedData: MarkerData[] = metaData.map((item: any) => {
  //   const pollutionItem = pollutionData.find(
  //     (data) => data.Kennzahl === item.Kennzahl,
  //   );

  //   return {
  //     innerValue: pollutionItem
  //       ? [
  //           pollutionItem.Verwendung,
  //           pollutionItem.VerwendungCO2,
  //           pollutionItem.Einfuhr,
  //           pollutionItem.EinfuhrCO2,
  //           pollutionItem.Ausfuhr,
  //         ]
  //       : [],
  //     values: item.Stoffgruppe.split(' ').map((value: string) =>
  //       parseFloat(value),
  //     ),
  //     radius: item.Radius || 20,
  //     stroke: item.Stroke || 1,
  //     lat: item.Latitude || 0,
  //     lon: item.Longitude || 0,
  //   };
  // });

  const locations: MarkerData[] = [
    {
      values: [10, 14, 3, 12, 8],
      radius: 30,
      stroke: 0.5,
      lat: 48.9998269,
      lon: 8.3519515,
      innerValue: 0,
    },
    {
      values: [20, 24, 13, 22, 18],
      radius: 20,
      stroke: 1,
      lat: 48.1371,
      lon: 11.5754,
      innerValue: 0,
    },
    {
      values: [30, 34, 23, 32, 28],
      radius: 25,
      stroke: 1.5,
      lat: 52.3794,
      lon: 9.7437,
      innerValue: 0,
    },
    // Add more locations as needed
  ];

  return (
    <>
      <Map markers={locations} />
    </>
  );
}
