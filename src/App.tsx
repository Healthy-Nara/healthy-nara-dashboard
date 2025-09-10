import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ParentPersonas from "./components/ParentPersonas";
import ParentDetail from "./components/ParentDetail";
import { Routes, Route, Navigate } from "react-router-dom";
import Caregivers from "./components/Caregivers";
import CaregiverForm from "./components/CaregiverForm";
import BookingList from "./components/BookingList";
import BookingForm from "./components/BookingForm";
import Children from "./components/Children";
import BookingDetail from "./components/BookingDetail";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Routing now controls active page

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const Placeholder = ({ title }: { title: string }) => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/parents" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/parents" element={<ParentPersonas />} />
              <Route path="/parents/:id" element={<ParentDetail />} />
              <Route path="/caregivers" element={<Caregivers />} />
              <Route path="/caregivers/new" element={<CaregiverForm />} />
              <Route path="/appointments" element={<BookingList />} />
              <Route path="/appointments/new" element={<BookingForm />} />
              <Route path="/appointments/:id" element={<BookingDetail />} />
              <Route path="/children" element={<Children />} />
              <Route
                path="/analytics"
                element={<Placeholder title="Analytics" />}
              />
              <Route
                path="/messages"
                element={<Placeholder title="Messages" />}
              />
              <Route
                path="/settings"
                element={<Placeholder title="Settings" />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
