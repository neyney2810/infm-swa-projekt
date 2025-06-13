'use client';

import React from 'react';
import { DataUnit } from '@/app/types';

type TableProps = {
  tableData: DataUnit[];
};

const Table: React.FC<TableProps> = ({ tableData }) => {
  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className={row.Wirtschaftszweig=="Insgesamt"||row.Stoffgruppe=="Insgesamt"?"hover:bg-red-50":"hover:bg-gray-50"}>
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
