import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Calendar, Clock, Users, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get } from "../lib/api";

interface BookingItem {
  _id: string;
  parentInfo: { _id: string; parentName: string };
  childInfo: { _id: string; childName: string };
  dutyDuration: string;
  dutyShift: string;
  dutyStartingtime: string;
  additionalNotes?: string;
}

export default function BookingList() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: json } = await get("/api/v1/booking");
      if (!json || !Array.isArray(json.data))
        throw new Error("Invalid response");
      setItems(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dateKey = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA"); // yyyy-mm-dd
  };

  const todayKey = useMemo(() => new Date().toLocaleDateString("en-CA"), []);
  const todayCount = useMemo(
    () => items.filter((b) => dateKey(b.dutyStartingtime) === todayKey).length,
    [items, todayKey]
  );
  const othersCount = items.length - todayCount;

  const filtered = useMemo(
    () =>
      dateFilter
        ? items.filter((b) => dateKey(b.dutyStartingtime) === dateFilter)
        : items,
    [items, dateFilter]
  );

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600">All scheduled bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                title="Clear date"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate("/appointments/new")}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-2xl font-bold text-primary-600">{todayCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Other days</p>
          <p className="text-2xl font-bold text-secondary-600">{othersCount}</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No bookings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-primary-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-gray-900 font-semibold">
                  <Users className="h-4 w-4 text-primary-600" />
                  <span>{b.parentInfo?.parentName || "Parent"}</span>
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <div>
                  <span className="text-sm">Child: </span>
                  <span className="text-sm font-medium">
                    {b.childInfo?.childName || "—"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary-600" />
                  <span className="text-sm">
                    {new Date(b.dutyStartingtime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <span className="text-sm capitalize">
                    {b.dutyDuration} • {b.dutyShift}
                  </span>
                </div>
                {b.additionalNotes && (
                  <p className="text-xs text-gray-600">{b.additionalNotes}</p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/appointments/${b._id}`)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
