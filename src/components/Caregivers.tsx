import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Phone,
  MapPin,
  User,
  Calendar,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get } from "../lib/api";
import { formatDisplayDate } from "../lib/date";

interface Caregiver {
  _id: string;
  caregiverName: string;
  contactNumber: string;
  gender: string | null;
  township: string | null;
  NRC: string | null;
  address: string | null;
  birthDate: string | null;
}

export default function Caregivers() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: json } = await get("/api/v1/caregiver-persona");
      if (json.code !== 200 || !Array.isArray(json.data))
        throw new Error("Invalid response");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load caregivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((c) =>
    [c.caregiverName, c.contactNumber, c.township || ""].some((v) =>
      (v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
          <p className="text-gray-600">Loading caregivers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={load}
          className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Caregivers</h2>
          <p className="text-gray-600">Browse and manage caregiver personas</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate("/caregivers/new")}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Caregiver</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search by name, phone, or township"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No caregivers found
          </h3>
          <p className="text-gray-600">Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-primary-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {c.caregiverName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {c.caregiverName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {c.gender
                        ? c.gender[0].toUpperCase() + c.gender.slice(1)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">{c.contactNumber || "—"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-secondary-600" />
                  <span className="text-sm">{c.township || "—"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">
                    {c.birthDate ? formatDisplayDate(c.birthDate) : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
