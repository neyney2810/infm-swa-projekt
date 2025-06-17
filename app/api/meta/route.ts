import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true'; // Check if all is true

    // Execute all three calls in parallel
    const [wirtschaftszweig, stoffgruppe, bundesland] = await Promise.all([
      getWirtschaftszweigOptions(all),
      getStoffgruppeOptions(all),
      getBundeslandOptions(all),
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
export async function getWirtschaftszweigOptions(all: boolean): Promise<
  { id: string; name: string }[]
> {
  const filePath = path.join(
    process.cwd(),
    'public',
    'utils',
    all ? 'data.csv' : 'data_trimmed.csv'
  );
  const wirtschaftszweigMap = new Map<string, string>();

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row['Wirtschaftszweig']) {
            wirtschaftszweigMap.set(row['Kennzahl'] || 'Insgesamt', row['Wirtschaftszweig']);
          }
        });

        // Map each Wirtschaftszweig to an object with Kennzahl as ID
        let options = Array.from(wirtschaftszweigMap.entries()).map(
          ([id, name]) => ({
            id,
            name,
          })
        );

        // Sort options so that "Insgesamt" is the first element
        options = options.sort((a, b) => (a.id === 'Insgesamt' ? -1 : b.id === 'Insgesamt' ? 1 : 0));

        resolve(options);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export async function getStoffgruppeOptions(all: boolean): Promise<{ id: string; name: string }[]> {
  const filePath = path.join(
    process.cwd(),
    'public',
    'utils',
    all ? 'data.csv' : 'data_trimmed.csv'
  );
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
        let options = Array.from(stoffgruppeMap.entries()).map(
          ([name, id]) => ({
            id,
            name,
          })
        );

        // Sort options so that "Insgesamt" is the first element
        options = options.sort((a, b) => (a.id === 'Insgesamt' ? -1 : b.id === 'Insgesamt' ? 1 : 0));

        resolve(options);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

async function getBundeslandOptions(all: boolean): Promise<
  { id: string; name: string; lat: number; lon: number }[]
> {
  const filePath = path.join(
    process.cwd(),
    'public',
    'geo',
    'hauptstadt.json'
  );
  const bundeslandMap = new Map<string, { name: string; lat: number; lon: number }>();

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
    });

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
    });

    fileStream.on('error', (error) => {
      console.error('Error reading file:', error);
      reject(error);
    });
  });
}
