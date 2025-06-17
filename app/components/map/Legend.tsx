'use client';

import { LegendProps } from '@/app/types';
import React from 'react';

const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="flex flex-row items-center gap-4 border-t p-4 border-gray-300 bg-white">
      {items.map((item, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
