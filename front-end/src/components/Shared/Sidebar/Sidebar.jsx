'use client'

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Bell,
  Home,
  Folder,
  Files,
  Settings,
  PieChart,
  Menu as MenuIcon,
  X
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Materials', href: '/materials', icon: Folder },
  { name: 'Jobs', href: '/jobs', icon: Files },
  { name: 'Machine Usage', href: '/machine-usage', icon: Settings },
  { name: 'Reports', href: '/reports', icon: PieChart },
]

const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Sign Out', href: '/logout' },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="relative min-h-screen">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex-1 px-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-green-100 text-green-900"
                      : "hover:bg-green-50 text-gray-700 hover:text-green-900"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    location.pathname === item.href ? "text-green-600" : "text-gray-400"
                  )} />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-6">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex-1 px-4 pb-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium mb-1 transition-colors",
                  location.pathname === item.href
                    ? "bg-green-100 text-green-900"
                    : "hover:bg-green-50 text-gray-700 hover:text-green-900"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  location.pathname === item.href ? "text-green-600" : "text-gray-400"
                )} />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden px-4"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form className="w-full max-w-lg" action="#">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </form>
            </div>

            <div className="ml-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <img
                      className="rounded-full"
                      src="/api/placeholder/32/32"
                      alt="User Avatar"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {userNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <a
                        href={item.href}
                        className="w-full cursor-pointer"
                      >
                        {item.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto px-4 py-4">
            <p className="text-center text-sm text-gray-500">
              Designed, developed and maintained by{' '}
              <a
                href="https://chachatech.com"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Chacha Technologies
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}