'use client';

import React, { useState, useEffect } from 'react';
import { useTableContext } from './Context';

const Filter: React.FC = () => {
  const { filter, setFilter } = useTableContext();
  const [stoffgruppe, setStoffgruppe] = useState<string | null>(null);
  const [wirtschaftszweig, setWirtschaftszweig] = useState<string | null>(null);
  const [wirtschaftszweigOptions, setWirtschaftszweigOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [stoffgruppeOptions, setStoffgruppeOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch('/api/meta');
        if (!response.ok) {
          throw new Error('Failed to fetch Wirtschaftszweig options');
        }
        const data = await response.json();
        setWirtschaftszweigOptions(data.wirtschaftszweig || []);
        setStoffgruppeOptions(data.stoffgruppe || []);
      } catch (error) {
        console.error('Error fetching Wirtschaftszweig options:', error);
      }
    };

    fetchMetaData();
  }, []);

  const handleStoffgruppeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStoffgruppe(e.target.value || null);
  };

  const handleWirtschaftszweigChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setWirtschaftszweig(e.target.value || null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border border-gray-300 rounded-md">
      <div className="col-span-1 flex flex-row items-center gap-2">
        <label htmlFor="stoffgruppe" className="font-medium">
          Stoffgruppe:
        </label>
        <select
          id="stoffgruppe"
          value={stoffgruppe || ''}
          onChange={handleStoffgruppeChange}
          className="border border-gray-300 rounded-md px-2 py-1 w-full"
        >
          <option value="">Select Stoffgruppe</option>
          {stoffgruppeOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
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
