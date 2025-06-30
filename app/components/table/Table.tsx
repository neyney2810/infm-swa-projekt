'use client';

import React from 'react';
import { DataUnit } from '@/app/types';

type TableProps = {
  tableData: DataUnit[];
  tableHeader?: Record<keyof DataUnit, string>;
};

const Table: React.FC<TableProps> = ({ tableData, tableHeader }) => {
  const keyHeaders = Object.keys(tableHeader || {}) as (keyof DataUnit)[];
  return (
    <div className="overflow-auto border border-gray-300">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {keyHeaders.map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {tableHeader ? tableHeader[header] : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${
                row.Stoffgruppe === 'Insgesamt' ||
                row.Wirtschaftszweig === 'Insgesamt'
                  ? 'bg-yellow-100'
                  : ''
              }`}
            >
              {keyHeaders.map((header) => (
                <td key={header} className="border border-gray-300 px-4 py-2">
                  {String((row as Record<string, any>)[header])}
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
