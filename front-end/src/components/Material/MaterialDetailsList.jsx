import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MaterialDetailsList = ({ materials, onUpdate, onDelete }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {materials.map((material) => (
        <li key={material.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">{material.name}</p>
              <p className="mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-50 ring-1 ring-inset ring-gray-500/10 whitespace-nowrap">
                Stock: {material.stockLevel}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">Cost: ${material.costPerUnit} per unit</p>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate">Supplier: {material.supplier || 'N/A'}</p>
            </div>
          </div>

          <div className="flex flex-none items-center gap-x-4">
            <button
              onClick={() => onUpdate(material)}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
            >
              Update
            </button>
            <button
              onClick={() => onDelete(material)}
              className="hidden rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 ring-1 shadow-xs ring-red-300 ring-inset hover:bg-red-100 sm:block"
            >
              Delete
            </button>

            <Menu as="div" className="relative flex-none">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-none"
              >
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => onUpdate(material)}
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block w-full px-3 py-1 text-left text-sm font-medium text-gray-700 hover:text-gray-900'
                      )}
                    >
                      Update
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(material)}
                      className={classNames(
                        active ? 'bg-gray-50' : '',
                        'block w-full px-3 py-1 text-left text-sm font-medium text-red-600 hover:text-red-800'
                      )}
                    >
                      Delete
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MaterialDetailsList;
