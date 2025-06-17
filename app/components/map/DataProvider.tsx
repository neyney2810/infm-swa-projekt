'use server';

import { DataUnit, MarkerData, MetaData } from '@/app/types';
import Map from './Map';

async function fetchMetaData(): Promise<MetaData | null> {
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
  wirtschaftszweig?: string;
  stoffgruppe?: string;
  show?: string;
};

// Wirtschaftszweig ausgewählt, stoffgruppe nicht gewählt -> Tortendiagramm mit Stoffgruppe auf Außenseite, größe stoffgruppe insgesamt
// Wirtschaftszweig nicht gewählt, stoffgruppe ausgewählt -> Tortendiagramm mit Wirtschaftszweig auf Außenseite, größe wirtschaftszweig insgesamt
// Wirtschaftszweig gewählt, stoffgruppe gewählt -> punkt in größe
// Wirtschaftszweig nicht gewählt oder insgesamt, stoffgruppe nicht gewählt oder insgesamt -> zusätzlicher boolean-schalter was auf außenseite

const getShowType = (
  wirtschaftszweig: string | undefined,
  stoffgruppe: string | undefined,
): 'point' | 'donut' => {
  if (wirtschaftszweig && wirtschaftszweig !== 'Insgesamt' && !stoffgruppe) {
    return 'donut';
  }
  if (!wirtschaftszweig && stoffgruppe && stoffgruppe !== 'Insgesamt') {
    return 'donut';
  }
  return 'point';
};

export async function DataProvider({
  pollutionData,
  wirtschaftszweig,
  stoffgruppe,
  show,
}: DataProviderProps) {
  const metaData = await fetchMetaData();

  if (!metaData) {
    return <div>Error loading meta data</div>;
  }

  const formatMarkerData = (
    wirtschaftszweig: string | undefined,
    stoffgruppe: string | undefined,
    pollutionData: DataUnit[],
  ) => {
    let markerData: MarkerData[] = [];
    // Wirtschaftszweig nicht gewählt, stoffgruppe ausgewählt -> Tortendiagramm mit Wirtschaftszweig auf Außenseite, größe wirtschaftszweig insgesamt
    if (!wirtschaftszweig && stoffgruppe && stoffgruppe !== 'Insgesamt') {
      // Convert pollutionData to MarkerData format
      markerData = metaData.bundesland.map((data) => ({
        values: pollutionData
          .filter(
            (item) =>
              item.Bundesland === data.id &&
              item.Stoffgruppe.split(' ')[0].toLowerCase() ===
                stoffgruppe.toLowerCase(),
          )
          .map((item) => item.Verwendung),
        radius: 20,
        stroke: 1,
        lat: data.lat,
        lon: data.lon,
        innerValue:
          pollutionData.find((item) => {
            return (
              item.Bundesland === data.id &&
              item.Stoffgruppe.split(' ')[0].toLowerCase() ===
                stoffgruppe.toLowerCase() &&
              item.Wirtschaftszweig === 'Insgesamt'
            );
          })?.Verwendung || -1, // Placeholder for inner value
      }));
      return markerData;
    }
    // Wirtschaftszweig ausgewählt, stoffgruppe nicht gewählt -> Tortendiagramm mit Stoffgruppe auf Außenseite, größe stoffgruppe insgesamt
    if (wirtschaftszweig && wirtschaftszweig !== 'Insgesamt' && !stoffgruppe) {
      // Convert pollutionData to MarkerData format
      markerData = metaData.bundesland.map((data) => ({
        values: pollutionData
          .filter(
            (item) =>
              item.Bundesland === data.id && item.Kennzahl === wirtschaftszweig,
          )
          .map((item) => item.Verwendung),
        radius: 30,
        stroke: 1,
        lat: data.lat,
        lon: data.lon,
        innerValue:
          pollutionData.find((item) => {
            return (
              item.Bundesland === data.id &&
              item.Kennzahl === wirtschaftszweig &&
              item.Stoffgruppe === 'Insgesamt'
            );
          })?.Verwendung || -1, // Placeholder for inner value
      }));
      return markerData;
    }
    // Wirtschaftszweig gewählt, stoffgruppe gewählt -> punkt in größe
    if (wirtschaftszweig && stoffgruppe) {
      // Convert pollutionData to MarkerData format
      markerData = pollutionData
        .filter(
          (item) =>
            item.Kennzahl === wirtschaftszweig &&
            item.Stoffgruppe.split(' ')[0].toLowerCase() ===
              stoffgruppe.toLowerCase(),
        )
        .map((item) => ({
          values: [],
          radius: 25,
          stroke: 1,
          lat:
            metaData.bundesland.find((data) => data.id === item.Bundesland)
              ?.lat || 0,
          lon:
            metaData.bundesland.find((data) => data.id === item.Bundesland)
              ?.lon || 0,
          innerValue: item.Verwendung, // Use the value directly
        }));
      return markerData;
    }
    // Wirtschaftszweig nicht gewählt oder insgesamt, stoffgruppe nicht gewählt oder insgesamt -> zusätzlicher boolean-schalter was auf außenseite
    // Default case: return all data as points
    markerData = pollutionData.map((item) => ({
      values: [],
      radius: 20,
      stroke: 1,
      lat:
        metaData.bundesland.find((data) => data.id === item.Bundesland)?.lat ||
        0,
      lon:
        metaData.bundesland.find((data) => data.id === item.Bundesland)?.lon ||
        0,
      innerValue: item.Verwendung, // Use the value directly
    }));
  };

  // const locations: MarkerData[] = [
  //   {
  //     values: [10, 14, 3, 12, 8],
  //     radius: 30,
  //     stroke: 0.5,
  //     lat: 48.9998269,
  //     lon: 8.3519515,
  //     innerValue: 0,
  //   },
  //   {
  //     values: [20, 24, 13, 22, 18],
  //     radius: 20,
  //     stroke: 1,
  //     lat: 48.1371,
  //     lon: 11.5754,
  //     innerValue: 0,
  //   },
  //   {
  //     values: [30, 34, 23, 32, 28],
  //     radius: 25,
  //     stroke: 1.5,
  //     lat: 52.3794,
  //     lon: 9.7437,
  //     innerValue: 0,
  //   },
  //   // Add more locations as needed
  // ];

  return (
    <>
      <Map
        markers={formatMarkerData(wirtschaftszweig, stoffgruppe, pollutionData)}
        showType={getShowType(wirtschaftszweig, stoffgruppe)}
      />
    </>
  );
}
