import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const options = await getWirtschaftszweigOptions();
      res.status(200).json({ options });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Wirtschaftszweig options" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function getWirtschaftszweigOptions(): Promise<{ id: number; name: string }[]> {
  const filePath = path.join(process.cwd(), "public", "utils", "data-copy.csv");
  const wirtschaftszweigSet = new Set<string>();

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    Papa.parse(fileStream, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          if (row["Wirtschaftszweig"]) {
            wirtschaftszweigSet.add(row["Wirtschaftszweig"]);
          }
        });

        // Map each Wirtschaftszweig to an object with an ID
        const options = Array.from(wirtschaftszweigSet).map((name, index) => ({
          id: index + 1,
          name
        }));

        resolve(options);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
