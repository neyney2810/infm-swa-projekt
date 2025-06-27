'use client';

import { LegendProps } from '@/app/types';
import React from 'react';

const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="border-t border-gray-300 bg-white">
      {items.length > 3 ? (
        <details className="p-4">
          <summary className="cursor-pointer text-sm font-medium">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </summary>
          <div className="flex flex-row items-center gap-4 flex-wrap mt-2">
            {items.slice(3).map((item, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </details>
      ) : (
        <div className="p-4 flex flex-row items-center gap-4 flex-wrap">
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
      )}
    </div>
  );
};

export default Legend;
