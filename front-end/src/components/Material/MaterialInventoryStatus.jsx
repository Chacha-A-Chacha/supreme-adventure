import React from 'react';
import { Badge } from "@/components/ui/badge";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MaterialInventoryStatus = ({ materials = [], lowStockThreshold = 20 }) => {
  const getStockStatus = (stockLevel, minThreshold) => {
    const ratio = stockLevel / minThreshold;
    if (ratio <= 1) return 'bg-red-600';
    if (ratio <= 1.5) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground">Material Stock Status</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <li key={material.id} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={classNames(
                getStockStatus(material.stock_level, material.min_threshold),
                'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
              )}
            >
              {getInitials(material.name)}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <p className="font-medium text-gray-900">
                  {material.name}
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-gray-500">
                    Stock: {material.stock_level} {material.unit_of_measure}
                  </p>
                  <p className="text-gray-500">
                    Cost: KES {material.cost_per_unit}/{material.unit_of_measure}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialInventoryStatus;