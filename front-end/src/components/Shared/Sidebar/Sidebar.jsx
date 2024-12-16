'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Materials', href: '/materials', icon: FolderIcon, current: false },
  { name: 'Jobs', href: '/jobs', icon: DocumentDuplicateIcon, current: false },
  { name: 'Machine Usage', href: '/machine-usage', icon: Cog6ToothIcon, current: false },
  { name: 'Reports', href: '/reports', icon: ChartPieIcon, current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Sign Out', href: '/logout' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />

          <div className="fixed inset-0 flex">
            <DialogPanel className="relative flex w-full max-w-xs flex-1 bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-col gap-y-5 px-6 pb-4">
                <div className="flex h-16 items-center">
                  <img
                    src="/assets/react.svg"
                    alt="Company Logo"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex-1">
                  <ul className="space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-100 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                            'group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? 'text-indigo-600'
                                : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <div className="flex h-16 items-center">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex-1">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-100 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-64">
          <div className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                <form className="w-full" action="#">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center lg:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://via.placeholder.com/150"
                        alt="User Avatar"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            <div className="py-6">{/* Content goes here */}</div>
          </main>
        </div>
      </div>
    </>
  )
}