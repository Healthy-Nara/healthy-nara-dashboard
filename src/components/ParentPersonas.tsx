import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, RefreshCw } from "lucide-react";
import ParentCard from "./ParentCard";
import { useNavigate } from "react-router-dom";
import { get } from "../lib/api";

interface Parent {
  _id: string;
  parentName: string;
  contactNumber: string;
  township: string;
  address: string;
  religion: string;
  nearestBusStop: string;
  durationOfBusStopToHome: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  code: number;
  status: string;
  messgae: string;
  data: {
    parentPersona: Parent[];
  };
}

interface ParentPersonasProps {
  onViewParent?: (id: string) => void;
}

export default function ParentPersonas({ onViewParent }: ParentPersonasProps) {
  const navigate = useNavigate();
  const [parents, setParents] = useState<Parent[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReligion, setSelectedReligion] = useState("all");

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await get<ApiResponse>("/api/v1/parent");

      if (data.code === 200 && data.data.parentPersona) {
        setParents(data.data.parentPersona);
        setFilteredParents(data.data.parentPersona);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    let filtered = parents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (parent) =>
          parent.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent.township.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent.contactNumber.includes(searchTerm)
      );
    }

    // Filter by religion
    if (selectedReligion !== "all") {
      filtered = filtered.filter(
        (parent) =>
          parent.religion.toLowerCase() === selectedReligion.toLowerCase()
      );
    }

    setFilteredParents(filtered);
  }, [searchTerm, selectedReligion, parents]);

  const uniqueReligions = [
    ...new Set(parents.map((parent) => parent.religion)),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading parent personas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-sm">!</span>
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchParents}
              className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parent Personas</h2>
          <p className="text-gray-600">
            Manage and view all registered parents
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchParents}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Parent</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Parents</p>
          <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Filters</p>
          <p className="text-2xl font-bold text-primary-600">
            {filteredParents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Religions</p>
          <p className="text-2xl font-bold text-secondary-600">
            {uniqueReligions.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Avg Response</p>
          <p className="text-2xl font-bold text-secondary-700">2.4s</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, township, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedReligion}
                onChange={(e) => setSelectedReligion(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Religions</option>
                {uniqueReligions.map((religion) => (
                  <option key={religion} value={religion}>
                    {religion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Cards */}
      {filteredParents.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No parents found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredParents.map((parent) => (
            <ParentCard
              key={parent._id}
              parent={parent}
              onView={() =>
                onViewParent
                  ? onViewParent(parent._id)
                  : navigate(`/parents/${parent._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
