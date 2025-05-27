import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';
import { DataUnit } from '@/app/types';

// Gibt Daten alle Bundesländer zurück, filter nach Wirtschatfszweig und Stoffgruppe zurück
export async function GET(request: Request) {
  try {
    // Resolve the path to the CSV file
    const filePath = path.join(process.cwd(), 'public', 'utils', 'data.csv');

    // Read the CSV file
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse the CSV content
    const parsedData = Papa.parse<DataUnit>(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;

    // Extract search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const wirtschaftszweig = searchParams.get('wirtschaftszweig') || '';
    const stoffgruppe = searchParams.get('stoffgruppe') || '';

    let filteredData: DataUnit[] = parsedData;

    // If only Stoffgruppe is provided, return all based on Stoffgruppe (each single stoffgruppe + insgesamt)
    if (!wirtschaftszweig && stoffgruppe) {
      filteredData = parsedData.filter((row) => {
        const stoffgruppeMatch =
          row.Stoffgruppe.split(' ')[0].toLowerCase() ===
          stoffgruppe.toLowerCase();
        return stoffgruppeMatch;
      });
    }
  
    // If only Wirtschaftszweig is provided, return all based on Wirtschaftszweig (each single wirtschaftszweig + insgesamt)
    if (wirtschaftszweig && !stoffgruppe) {
      filteredData = parsedData.filter((row) => {
        const wirtschaftszweigMatch =
          row.Kennzahl.toLowerCase() === wirtschaftszweig.toLowerCase();
        return wirtschaftszweigMatch;
      });
    }
  
    // If both Wirtschaftszweig and Stoffgruppe are provided, filter based on both
    if (wirtschaftszweig && stoffgruppe) {
      filteredData = parsedData.filter((row) => {
        const wirtschaftszweigMatch =
          row.Kennzahl.toLowerCase() === wirtschaftszweig.toLowerCase();
        const stoffgruppeMatch =
          row.Stoffgruppe.split(' ')[0].toLowerCase() ===
          stoffgruppe.toLowerCase();
        return wirtschaftszweigMatch && stoffgruppeMatch;
      });
    }
  
    // If neither Wirtschaftszweig nor Stoffgruppe is provided, return only data for "Insgesamt"
    if (!wirtschaftszweig && !stoffgruppe) {
      filteredData = parsedData.filter((row) => {
        const wirtschaftszweigMatch = row.Wirtschaftszweig.toLowerCase() === 'insgesamt';
        const stoffgruppeMatch =
          row.Stoffgruppe.split(' ')[0].toLowerCase() === 'insgesamt';
        return wirtschaftszweigMatch && stoffgruppeMatch;
      });
    }

    // Return the parsed data as JSON
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and parse CSV data' },
      { status: 500 },
    );
  }

}



export const dynamic = 'force-dynamic';
