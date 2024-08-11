import {
  Menu,
  Calendar,
  ChartPie,
  DownloadCloud,
  Folder,
  Home,
  Users,
  X,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dash", icon: Home, current: true },
  { name: "Account", href: "/account", icon: Users, current: false },
  // { name: "Projects", href: "#", icon: Folder, current: false },
  // { name: "Calendar", href: "#", icon: Calendar, current: false },
  // { name: "Documents", href: "#", icon: DownloadCloud, current: false },
  // { name: "Reports", href: "#", icon: ChartPie, current: false },
];

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export const Sidebar = () => {
  return (
    <div className="flex flex-col h-full px-6 pb-2 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
      <div className="items-center hidden h-16 shrink-0 lg:flex">
        <Image
          alt="StartupKit"
          src="/startupkit-logo.svg"
          className="w-auto h-12 -ml-3"
          width={100}
          height={100}
        />
      </div>
      <nav className="flex flex-col flex-1 mt-20 lg:mt-0">
        <ul role="list" className="flex flex-col flex-1 gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={clsx(
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={clsx(
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

          {/* <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your teams
            </div>
            <ul role="list" className="mt-2 -mx-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <a
                    href={team.href}
                    className={clsx(
                      team.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    )}
                  >
                    <span
                      className={clsx(
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
          </li> */}
        </ul>
      </nav>
    </div>
  );
};
