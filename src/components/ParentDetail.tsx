import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Church,
  Bus,
  Clock,
  Users,
} from "lucide-react";

interface Child {
  _id: string;
  childName: string;
  birthDate: string;
  gender: string;
}

interface ParentDetailData {
  _id: string;
  parentName: string;
  contactNumber: string;
  township: string;
  address: string;
  religion: string;
  nearestBusStop: string;
  durationOfBusStopToHome: string;
  createdAt?: string;
  updatedAt?: string | null;
  children: Child[];
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: ParentDetailData;
}

import { useNavigate, useParams } from "react-router-dom";
import { get } from "../lib/api";
import { formatDisplayDate } from "../lib/date";

interface ParentDetailProps {
  id?: string;
  onBack?: () => void;
}

export default function ParentDetail({ id, onBack }: ParentDetailProps) {
  const params = useParams();
  const navigate = useNavigate();
  const effectiveId = id || params.id || "";
  const [data, setData] = useState<ParentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: json } = await get<ApiResponse>(
          `/api/v1/parent/${effectiveId}`
        );
        if (json.code !== 200 || !json.data)
          throw new Error("Invalid response");
        setData(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load parent");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [effectiveId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 text-sm">{error || "No data"}</p>
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.parentName}
          </h2>
        </div>
        <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
          {data.parentName.charAt(0)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parent Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="h-4 w-4 text-primary-600" />
              <span className="text-sm">{data.contactNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="h-4 w-4 text-secondary-600" />
              <span className="text-sm">
                {data.address}, {data.township}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Church className="h-4 w-4 text-primary-600" />
              <span className="text-sm">{data.religion}</span>
            </div>
            {/* <div className="flex items-center space-x-2 text-gray-700"> */}
            <div className="flex items-center space-x-2 text-gray-700">
              <Bus className="h-4 w-4 text-secondary-600" />
              <span className="text-xs text-gray-700">
                {data.nearestBusStop}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="h-4 w-4 text-primary-600" />
              <span className="text-xs text-gray-700">
                {data.durationOfBusStopToHome}
              </span>
            </div>
            {/* </div> */}
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Children</span>
              <span className="text-sm font-semibold text-primary-700">
                {data.children?.length || 0}
              </span>
            </div>
            {data.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registered</span>
                <span className="text-sm text-gray-900">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div> */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Children</h3>
          <div className="flex items-center text-secondary-700 text-sm">
            <Users className="h-4 w-4 mr-1" />
            {data.children?.length || 0}
          </div>
        </div>
        {!data.children || data.children.length === 0 ? (
          <p className="text-sm text-gray-600">No children found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.children.map((child) => (
              <div
                key={child._id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {child.childName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {child.gender} • {formatDisplayDate(child.birthDate)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center text-xs font-semibold">
                  {child.childName.charAt(0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
