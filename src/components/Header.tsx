// React import not needed with TSX in Vite
import { Bell, Settings, Menu } from "lucide-react";
import logo from "../assets/Vector.png";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 h-16 px-6">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3 ps-1">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-md" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HealthyNara</h1>
              <p className="text-sm text-gray-500">Caregiving Dashboard</p>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-secondary-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
        </div> */}
      </div>
    </header>
  );
}
