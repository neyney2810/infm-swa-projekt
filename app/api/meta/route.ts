import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const options = await getWirtschaftszweigOptions();
    return NextResponse.json({ wirtschaftszweig: options });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Wirtschaftszweig options' },
      { status: 500 }
    );
  }
}

export async function getWirtschaftszweigOptions(): Promise<
  { id: number; name: string }[]
> {
  const filePath = path.join(process.cwd(), 'public', 'utils', 'data-copy.csv');
  const wirtschaftszweigSet = new Set<string>();

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row['Wirtschaftszweig']) {
            wirtschaftszweigSet.add(row['Wirtschaftszweig']);
          }
        });

        // Map each Wirtschaftszweig to an object with an ID
        const options = Array.from(wirtschaftszweigSet).map((name, index) => ({
          id: index + 1,
          name,
        }));

        resolve(options);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
