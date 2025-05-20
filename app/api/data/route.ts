import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';
import { DataUnit } from '@/app/types';

// Gibt Daten alle Bundesländer zurück, filter nach Wirtschatfszweig und Stoffgruppe zurück
export async function GET(request: Request) {
  try {
    // Resolve the path to the CSV file
    const filePath = path.join(
      process.cwd(),
      'public',
      'utils',
      'data-copy.csv'
    );

    // Read the CSV file
    const fileContent = await fs.readFile(filePath, 'latin1');

    // Parse the CSV content
    const parsedData = Papa.parse<DataUnit>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Extract search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const wirtschaftszweig = searchParams.get('wirtschaftszweig') || 'Insgesamt';
    const stoffgruppe = searchParams.get('stoffgruppe') || 'Insgesamt';

    // Filter the parsed data based on the query parameters
    const filteredData = parsedData.data.filter((row) => {
      const wirtschaftszweigMatch =
        row.Kennzahl.toLowerCase() === wirtschaftszweig.toLowerCase();
      const stoffgruppeMatch =
        row.Stoffgruppe.split(" ")[0].toLowerCase() === stoffgruppe.toLowerCase();
      return wirtschaftszweigMatch && stoffgruppeMatch;
    });
    // Return the parsed data as JSON
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and parse CSV data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
