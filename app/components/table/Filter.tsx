'use client';

import React, { useState, useEffect } from 'react';
import { useTableContext } from './Context';
import { Bundesland } from '@/app/types';

const Filter: React.FC = () => {
  const { filter, setFilter } = useTableContext();
  const [bundesland, setBundesland] = useState<string | null>(
    filter.bundesland
  );
  const [wirtschaftszweig, setWirtschaftszweig] = useState<string | null>(null);
  const [wirtschaftszweigOptions, setWirtschaftszweigOptions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchWirtschaftszweigOptions = async () => {
      try {
        const response = await fetch('/api/meta');
        if (!response.ok) {
          throw new Error('Failed to fetch Wirtschaftszweig options');
        }
        const data = await response.json();
        setWirtschaftszweigOptions(data.wirtschaftszweig || []);
      } catch (error) {
        console.error('Error fetching Wirtschaftszweig options:', error);
      }
    };

    fetchWirtschaftszweigOptions();
  }, []);

  const handleBundeslandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBundesland(e.target.value || null);
  };

  const handleWirtschaftszweigChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setWirtschaftszweig(e.target.value || null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border border-gray-300 rounded-md">
      <div className="col-span-1 flex flex-row items-center gap-2">
        <label htmlFor="bundesland" className="font-medium">
          Bundesland:
        </label>
        <select
          id="bundesland"
          value={bundesland || ''}
          onChange={handleBundeslandChange}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="">Select Bundesland</option>
          {Object.entries(Bundesland).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1 flex flex-row items-center gap-2">
        <label htmlFor="wirtschaftszweig" className="font-medium">
          Wirtschaftszweig:
        </label>
        <select
          id="wirtschaftszweig"
          value={wirtschaftszweig || ''}
          onChange={handleWirtschaftszweigChange}
          className="border border-gray-300 rounded-md px-2 py-1 w-full"
        >
          <option value="">Select Wirtschaftszweig</option>
          {wirtschaftszweigOptions.map((option, index) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
