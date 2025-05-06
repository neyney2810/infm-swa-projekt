"use client";

import React, { useState } from "react";
import { useTableContext } from "./Context";
import { Bundesland } from "@/app/types";

const Filter: React.FC = () => {
  const { filter, setFilter } = useTableContext();
  const [year, setYear] = useState<number | null>(filter.year);
  const [bundesland, setBundesland] = useState<string | null>(filter.bundesland);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setYear(value);
  };

  const handleBundeslandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBundesland(e.target.value || null);
  };

  const applyFilters = () => {
    setFilter({ year, bundesland });
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border border-gray-300 rounded-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="year" className="font-medium">
          Year
        </label>
        <input id="year" type="number" value={year || ""} onChange={handleYearChange} placeholder="Enter year" className="border border-gray-300 rounded-md px-2 py-1" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="bundesland" className="font-medium">
          Bundesland
        </label>
        <select id="bundesland" value={bundesland || ""} onChange={handleBundeslandChange} className="border border-gray-300 rounded-md px-2 py-1">
          <option value="">Select Bundesland</option>
          {Object.entries(Bundesland).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
