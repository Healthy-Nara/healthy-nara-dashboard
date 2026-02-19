// React import not needed with TSX in Vite
import { Bell, Settings, Menu, LogOut } from "lucide-react";
import logo from "../assets/Vector.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("hn_auth");
    window.location.href = "/admin/login";
  };
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

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
