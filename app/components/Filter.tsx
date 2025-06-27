'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Filter: React.FC = () => {
  const router = useRouter();
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const defaultStoffgruppe = params.get('stoffgruppe') || 'Insgesamt';
  const defaultWirtschaftszweig = params.get('wirtschaftszweig') || 'Insgesamt';
  const [stoffgruppe, setStoffgruppe] = useState<string>(defaultStoffgruppe);
  const [wirtschaftszweig, setWirtschaftszweig] = useState<string>(
    defaultWirtschaftszweig,
  );
  const [wirtschaftszweigOptions, setWirtschaftszweigOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [stoffgruppeOptions, setStoffgruppeOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const [change, setPreviousChange] = useState<
    'wirtschaftszweig' | 'stoffgruppe' | null
  >(null);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        // Construct the API URL with query parameters
        const queryParams = new URLSearchParams();
        if (
          stoffgruppe &&
          change == 'stoffgruppe' &&
          stoffgruppe !== 'Insgesamt'
        ) {
          queryParams.set('stoffgruppe', stoffgruppe);
        }
        if (
          wirtschaftszweig &&
          change == 'wirtschaftszweig' &&
          wirtschaftszweig !== 'Insgesamt'
        ) {
          queryParams.set('wirtschaftszweig', wirtschaftszweig);
        }

        console.log('query Params', queryParams.toString());

        const response = await fetch(`/api/meta?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Wirtschaftszweig options');
        }
        const data = await response.json();
        console.log('Fetched Wirtschaftszweig options:', data);
        setWirtschaftszweigOptions(data.wirtschaftszweig || []);
        setStoffgruppeOptions(data.stoffgruppe || []);
      } catch (error) {
        console.error('Error fetching Wirtschaftszweig options:', error);
      }
    };

    fetchMetaData();
  }, [stoffgruppe, wirtschaftszweig]);

  const handleStoffgruppeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setStoffgruppe(selectedValue);
    setPreviousChange('stoffgruppe');

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
    const selectedValue = e.target.value;
    setWirtschaftszweig(selectedValue);
    setPreviousChange('wirtschaftszweig');
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
