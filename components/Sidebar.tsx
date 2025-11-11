"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


type Activity = {
  id: string;
  timestamp: Date;
  activity: "FAVORITED" | "WATCH_LATER";
  title: string; 
};

type SidebarProps = {
  activities: Activity[];
};

export default function Sidebar({ activities }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      name: "Watch Later",
      href: "/watch-later",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-[#1ED2AF] transition-all duration-300 ease-in-out z-40 ${
        isExpanded ? "w-60" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-[#00003c] text-white"
                  : "text-[#00003c] hover:bg-[#00003c] hover:text-white"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {isExpanded && (
        <div className="px-4 pt-6 border-t border-[#00003c]/20">
          <h3 className="text-[#00003c] font-bold mb-4">Latest Activities</h3>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-24rem)]">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="text-xs text-[#00003c] bg-white/20 rounded p-2"
              >
                <div className="text-[10px] opacity-75">
                  {formatDate(activity.created_at)}
                </div>
                <div className="mt-1">
                  {activity.action === "favorited" && "Favorited "}
                  {activity.action === "added_to_watch_later" &&
                    "Added "}
                  <span className="font-bold">{activity.title}</span>
                  {activity.action === "added_to_watch_later" &&
                    " to watch later"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}