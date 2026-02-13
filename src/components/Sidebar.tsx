// React import not needed with TSX in Vite
import {
  Users,
  Baby,
  Calendar,
  BarChart3,
  MessageCircle,
  Settings,
  Home,
  ClipboardList,
  UserCheck,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, to: "/dashboard" },
  { id: "parents", label: "Parent Personas", icon: Users, to: "/parents" },
  { id: "caregivers", label: "Caregivers", icon: UserCheck, to: "/caregivers" },
  { id: "children", label: "Children", icon: Baby, to: "/children" },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    to: "/appointments",
  },
  { id: "duties", label: "Duties", icon: ClipboardList, to: "/duties" },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
  { id: "messages", label: "Messages", icon: MessageCircle, to: "/messages" },
  { id: "terms", label: "Terms & Conditions", icon: FileText, to: "/terms" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const NavContent = ({ compact }: { compact?: boolean }) => (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to !== "/parents"}
            onClick={onClose}
            className={({ isActive }) =>
              `w-full flex items-center text-white ${
                compact ? "justify-start" : "justify-center"
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
                {compact && (
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
  );

  return (
    <>
      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          isOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        <div
          className={`absolute top-16 left-0 bottom-0 bg-[#136354] shadow-lg w-64 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <NavContent compact />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:block fixed top-16 left-0 z-40 bg-[#136354] shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } h-[calc(100vh-4rem)] border-r border-gray-200`}
      >
        <div className="p-4">
          <NavContent compact={isOpen} />
        </div>
      </aside>
    </>
  );
}
