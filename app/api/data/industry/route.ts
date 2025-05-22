// Get all pollutant data filter by industry -> Filter all the data which has a Kennzahl and Stoffgruppe = Insgesamt

import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import path from 'path';
import { promises as fs } from 'fs';
import { DataUnit } from '@/app/types';

export async function GET(request: Request) {
  try {
    // Resolve the path to the CSV file
    const filePath = path.join(
      process.cwd(),
      'public',
      'utils',
      'data.csv'
    );

    // Read the CSV file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse the CSV content
    const parsedData = Papa.parse<DataUnit>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Filter the data for industry
    const filteredData = parsedData.data.filter(
      (row) => row.Kennzahl && row.Stoffgruppe === 'Insgesamt'
    );

    // Return the filtered data as JSON
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and parse CSV data' },
      { status: 500 }
    );
  }
}
