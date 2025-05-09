"use client";

import React, { useEffect } from "react";
import { useTableContext } from "./Context";
import { DataUnit } from "@/app/types";

const Table: React.FC = () => {
  const { tableData, setTableData, filter } = useTableContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filter.year) queryParams.append("year", filter.year.toString());
        if (filter.bundesland) queryParams.append("land", filter.bundesland);

        const response = await fetch(`/api/data/land?${queryParams.toString()}&limit=10`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setTableData(jsonData as DataUnit[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter, setTableData]);

  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="border border-gray-300 px-4 py-2">
                  {(row as Record<string, any>)[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
