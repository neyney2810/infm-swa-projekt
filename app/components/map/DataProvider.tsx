import { MarkerData } from '@/app/types';
import Map from './Map';

export async function DataProvider() {
  // This function is a placeholder for the data provider logic.
  // You can implement your data fetching and processing logic here.
  // For example, you might want to fetch data from an API or a database.

  const locations: MarkerData[] = [
    {
      innerValues: [10, 14, 3, 12, 8],
      outerValues: [5, 7, 2, 6, 4],
      radius: 30,
      stroke: 0.5,
      lat: 48.9998269,
      lon: 8.3519515,
    },
    {
      innerValues: [20, 24, 13, 22, 18],
      outerValues: [15, 17, 12, 16, 14],
      radius: 20,
      stroke: 1,
      lat: 48.1371,
      lon: 11.5754,
    },
    {
      innerValues: [30, 34, 23, 32, 28],
      outerValues: [25, 27, 22, 26, 24],
      radius: 25,
      stroke: 1.5,
      lat: 52.3794,
      lon: 9.7437,
    },
    // Add more locations as needed
  ];
  return <Map markers={locations} />;
}
