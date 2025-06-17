'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Select: React.FC = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('verwendung');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    // Update the URL with the selected stoffgruppe
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('show', value);
    } else {
      params.delete('show');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="data-select" className="font-medium">
        Select Data:
      </label>
      <select
        id="data-select"
        value={selectedOption}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-2 py-1"
      >
        <option value="verwendung">Verwendung</option>
        <option value="co2">Verwendung CO2</option>
      </select>
    </div>
  );
};

export default Select;
