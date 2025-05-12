import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import Papa from 'papaparse';

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
    // https://www.npmjs.com/package/windows-1252
    const fileContent = await fs.readFile(filePath, 'latin1');

    // Parse the CSV content
    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Extract the 'land' query parameter
    // Example request URL: /api/data/land?land=bw&limit=10
    const url = new URL(request.url);
    const land = url.searchParams.get('land');

    // Map of codes to full names of Bundesland
    const bundeslandMap: { [key: string]: string } = {
      bw: 'Baden-W',
      by: 'Bayern',
      he: 'Hessen',
      bb: 'Brandenburg',
      be: 'Berlin',
      hb: 'Bremen',
      hh: 'Hamburg',
      mv: 'Mecklenburg-Vorpommern',
      ni: 'Niedersachsen',
      nw: 'Nordrhein-Westfalen',
      rp: 'Rheinland-Pfalz',
      sh: 'Schleswig-Holstein',
      sl: 'Saarland',
      sn: 'Sachsen',
      st: 'Sachsen-Anhalt',
      th: 'Thüringen',
      // Add other mappings as needed
    };

    // Extract the 'year' query parameter
    let year = url.searchParams.get('year');

    // Validate the 'year' parameter if provided
    if (year && isNaN(Number(year))) {
      year = '2023';
    }

    if (!land || !bundeslandMap[land]) {
      return NextResponse.json(
        { error: 'Invalid or missing Bundesland code' },
        { status: 400 }
      );
    }

    // Get the full name of the Bundesland from the code
    const bundeslandName = bundeslandMap[land];

    // Filter the data for the specified 'land'
    const filteredData = parsedData.data.filter((row: any) => {
      const matchesBundesland =
        row.Bundesland && row.Bundesland.includes(bundeslandName);
      const matchesYear = year ? row.Jahr && row.Jahr === year : true;
      return matchesBundesland && matchesYear;
    });

    // Extract the 'limit' query parameter
    const limit = parseInt(url.searchParams.get('limit') || '0', 10);

    // Limit the number of rows if 'limit' is provided
    const limitedData = limit > 0 ? filteredData.slice(0, limit) : filteredData;

    // Return the filtered and limited data as JSON
    return NextResponse.json(limitedData);
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and parse CSV data' },
      { status: 500 }
    );
  }
}
