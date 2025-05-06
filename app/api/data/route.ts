import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import Papa from "papaparse";

export async function GET(request: Request) {
  try {
    // Resolve the path to the CSV file
    const filePath = path.join(process.cwd(), "public", "utils", "data-copy.csv");

    // Read the CSV file
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Parse the CSV content
    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });

    // Extract the 'limit' query parameter
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "0", 10);

    // Limit the number of rows if 'limit' is provided
    const limitedData = limit > 0 ? parsedData.data.slice(0, limit) : parsedData.data;

    // Return the parsed data as JSON
    return NextResponse.json(limitedData);
  } catch (error) {
    console.error("Error reading or parsing CSV file:", error);
    return NextResponse.json({ error: "Failed to fetch and parse CSV data" }, { status: 500 });
  }
}
