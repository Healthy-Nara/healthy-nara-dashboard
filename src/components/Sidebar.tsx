import React from "react";
import {
  Users,
  Baby,
  Calendar,
  BarChart3,
  MessageCircle,
  Settings,
  Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, to: "/dashboard" },
  { id: "parents", label: "Parent Personas", icon: Users, to: "/parents" },
  { id: "caregivers", label: "Caregivers", icon: Users, to: "/caregivers" },
  { id: "children", label: "Children", icon: Baby, to: "/children" },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    to: "/appointments",
  },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
  { id: "messages", label: "Messages", icon: MessageCircle, to: "/messages" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`bg-[#136354] shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } min-h-screen border-r border-gray-200`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to !== "/parents"}
                className={({ isActive }) =>
                  `w-full flex items-center text-white ${
                    isOpen ? "justify-start" : "justify-center"
                  } space-x-3 px-5 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-primary-600"
                      : "text-gray-600 hover:bg-primary-50/40 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-primary" : "text-white"
                      }`}
                    />
                    {isOpen && (
                      <span
                        className={`font-medium truncate ${
                          isActive ? "text-primary" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
