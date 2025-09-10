import React, { useEffect, useState } from "react";
import { RefreshCw, User, Calendar, Users, MapPin } from "lucide-react";
import { get } from "../lib/api";

interface ChildItem {
  _id: string;
  childName: string;
  birthDate: string;
  gender: string;
  parentInfo?: { _id: string; parentName: string };
}

export default function Children() {
  const [items, setItems] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await get("/api/v1/child");
      const list: ChildItem[] = data?.data?.childPersona || [];
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
          <p className="text-gray-600">Loading children...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Children</h2>
          <p className="text-gray-600">All registered children</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No children found
          </h3>
          <p className="text-gray-600">Try refreshing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-primary-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {c.childName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {c.childName}
                    </p>
                    <p className="text-sm text-gray-500">{c.gender}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">
                    {new Date(c.birthDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-secondary-600" />
                  <span className="text-sm">
                    {c.parentInfo?.parentName || "—"}
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
