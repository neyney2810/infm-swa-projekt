import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Execute all three calls in parallel
    const [wirtschaftszweig, stoffgruppe, bundesland] = await Promise.all([
      getWirtschaftszweigOptions(),
      getStoffgruppeOptions(),
      getBundeslandOptions(),
    ]);

    // Return the options as JSON
    return NextResponse.json({ bundesland, wirtschaftszweig, stoffgruppe });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}

// Return Wirtschaftszweig options and its corresponding ID
export async function getWirtschaftszweigOptions(): Promise<
  { id: string; name: string }[]
> {
  const filePath = path.join(process.cwd(), 'public', 'utils', 'data.csv');
  const wirtschaftszweigMap = new Map<string, string>();

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row['Wirtschaftszweig'] && row['Kennzahl']) {
            wirtschaftszweigMap.set(row['Wirtschaftszweig'], row['Kennzahl']);
          }
        });

        // Map each Wirtschaftszweig to an object with Kennzahl as ID
        const options = Array.from(wirtschaftszweigMap.entries()).map(
          ([name, id]) => ({
            id,
            name,
          })
        );

        resolve(options);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

async function getStoffgruppeOptions(): Promise<{ id: string; name: string }[]> {
  const filePath = path.join(process.cwd(), 'public', 'utils', 'data.csv');
  const stoffgruppeMap = new Map<string, string>();

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row['Stoffgruppe']) {
            const name = row['Stoffgruppe'];
            const id = name.split(' ')[0]; // Extract the first word as the ID
            stoffgruppeMap.set(name, id);
          }
        });

        // Map each Stoffgruppe to an object with ID and name
        const options = Array.from(stoffgruppeMap.entries()).map(
          ([name, id]) => ({
            id,
            name,
          })
        );

        resolve(options);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

async function getBundeslandOptions(): Promise<
  { id: string; name: string, lat: number, lon: number}[]> {
  const filePath = path.join(process.cwd(), 'public', 'geo', 'hauptstadt.json');
  const bundeslandMap = new Map<string, { name: string, lat: number, lon: number}>();
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
 
    fileStream.on('data', (data) => {
      const jsonData = JSON.parse(data.toString());
      jsonData.features.forEach((feature: any) => {
        const name = feature.name;
        const bundesland = feature.bundesland;
        const lat = feature.lat;
        const lon = feature.lon;

        if (bundesland && name && lat && lon) {
          bundeslandMap.set(bundesland, { name, lat, lon });
        }

      
     
      });
    }
    );
    fileStream.on('end', () => {
      // Map each Bundesland to an object with ID and name
      const options = Array.from(bundeslandMap.entries()).map(
        ([name, { lat, lon }]) => ({
          id: name,
          name,
          lat,
          lon,
        })
      );

      resolve(options);
    }
    );
    fileStream.on('error', (error) => {
      console.error('Error reading file:', error);
      reject(error);
    }
    )
  });
}
