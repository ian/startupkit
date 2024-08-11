"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Calendar,
  ChartPie,
  DownloadCloud,
  Folder,
  Home,
  Users,
  X,
} from "lucide-react"; // Updated import from @heroicons to ludic-react
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "#", icon: Home, current: true },
  { name: "Team", href: "#", icon: Users, current: false },
  { name: "Projects", href: "#", icon: Folder, current: false },
  { name: "Calendar", href: "#", icon: Calendar, current: false },
  { name: "Documents", href: "#", icon: DownloadCloud, current: false },
  { name: "Reports", href: "#", icon: ChartPie, current: false },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div
      //
      >
        <div className={sidebarOpen ? "block" : "hidden"}>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: sidebarOpen ? 1 : 0,
              x: sidebarOpen ? 0 : -100,
            }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }} // Speed increased by 50%
            className={`fixed inset-0 flex`}
          >
            <div
              className="fixed inset-0 bg-gray-900/80"
              onClick={() => setSidebarOpen(false)}
              // onClick={console.log}
            />
            <motion.div
              className="relative flex flex-1 w-full max-w-xs mr-16 transform bg-white"
              initial={{ x: "-100%" }}
              animate={{ x: sidebarOpen ? 0 : "-100%" }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }} // Speed increased by 50%
            >
              <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X aria-hidden="true" className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col px-6 pb-2 overflow-y-auto grow gap-y-5">
                <div className="flex items-center h-16 shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="w-auto h-8"
                  />
                </div>
                <nav className="flex flex-col flex-1">
                  <ul role="list" className="flex flex-col flex-1 gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "h-6 w-6 shrink-0",
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" className="mt-2 -mx-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={classNames(
                                team.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <span
                                className={classNames(
                                  team.current
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                )}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden sm:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col px-6 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
            <div className="flex items-center h-16 shrink-0">
              <Image
                alt="StartupKit"
                src="/startupkit-logo.svg"
                className="w-auto h-12 -ml-3"
                width={100}
                height={100}
              />
            </div>
            <nav className="flex flex-col flex-1">
              <ul role="list" className="flex flex-col flex-1 gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0",
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" className="mt-2 -mx-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? "border-indigo-600 text-indigo-600"
                                : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto -mx-6">
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm font-semibold leading-6 text-gray-900 gap-x-4 hover:bg-gray-50"
                  >
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="w-8 h-8 rounded-full bg-gray-50"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu aria-hidden="true" className="w-6 h-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-8 h-8 rounded-full bg-gray-50"
            />
          </a>
        </div>

        <main className="h-screen py-10 lg:pl-72 bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
