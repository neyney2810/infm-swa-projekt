'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Filter: React.FC = () => {
  const router = useRouter();
  const [stoffgruppe, setStoffgruppe] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('stoffgruppe');
  });
  const [wirtschaftszweig, setWirtschaftszweig] = useState<string | null>(
    () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('wirtschaftszweig');
    },
  );
  const [wirtschaftszweigOptions, setWirtschaftszweigOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [stoffgruppeOptions, setStoffgruppeOptions] = useState<
    { id: number; name: string }[]
  >([]);

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
    const selectedValue = e.target.value || null;
    setStoffgruppe(selectedValue);

    // Update the URL with the selected stoffgruppe
    const params = new URLSearchParams(window.location.search);
    if (selectedValue) {
      params.set('stoffgruppe', selectedValue);
    } else {
      params.delete('stoffgruppe');
    }
    router.push(`?${params.toString()}`);
  };

  const handleWirtschaftszweigChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = e.target.value || null;
    setWirtschaftszweig(selectedValue);

    // Update the URL with the selected wirtschaftszweig
    const params = new URLSearchParams(window.location.search);
    if (selectedValue) {
      params.set('wirtschaftszweig', selectedValue);
    } else {
      params.delete('wirtschaftszweig');
    }
    router.push(`?${params.toString()}`);
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
          {stoffgruppeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
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
          {wirtschaftszweigOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
