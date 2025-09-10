import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../lib/api";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";

interface BookingItem {
  _id: string;
  parentInfo: { _id: string } | string;
  childInfo: { _id: string } | string;
  dutyDuration: string;
  dutyShift: string;
  dutyStartingtime: string;
  additionalNotes?: string;
}

interface ParentData {
  _id: string;
  parentName: string;
  contactNumber?: string;
  address?: string;
  township?: string;
  religion?: string;
}
interface ChildData {
  _id: string;
  childName: string;
  birthDate?: string;
  gender?: string;
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [parent, setParent] = useState<ParentData | null>(null);
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        // There is no explicit GET /booking/:id documented; fetch all and find one
        const { data: all } = await get<{
          status: string;
          data: BookingItem[];
        }>("/api/v1/booking");
        const item = (all?.data || []).find((b) => b._id === id) || null;
        if (!item) throw new Error("Booking not found");
        setBooking(item);

        const parentId =
          typeof item.parentInfo === "string"
            ? item.parentInfo
            : item.parentInfo?._id;
        const childId =
          typeof item.childInfo === "string"
            ? item.childInfo
            : item.childInfo?._id;

        if (parentId) {
          console.log("childId", childId);
          const { data: pres } = await get<any>(`/api/v1/parent/${parentId}`);
          setParent(pres?.data || null);
          console.log("pres", pres?.data?.children);
          setChild(
            pres?.data?.children?.find((c: any) => c._id === childId) || null
          );
        }

        // if (childId) {
        //   const { data: cres } = await get<any>(`/api/v1/child/${childId}`);
        //   setChild(cres?.data || null);
        // }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  console.log(parent);
  //   console.log(childId);
  console.log(child);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-600">
        Loading...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-sm text-red-700">{error || "No data"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Booking Detail</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Info
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-secondary-600" />
              <span className="text-sm">
                {new Date(booking.dutyStartingtime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary-600" />
              <span className="text-sm capitalize">
                {booking.dutyDuration} • {booking.dutyShift}
              </span>
            </div>
            {booking.additionalNotes && (
              <p className="text-sm">Notes: {booking.additionalNotes}</p>
            )}
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="h-4 w-4 text-primary-600" />
              <span className="text-sm">
                Parent: {parent?.parentName || "—"}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              Child: {child?.childName || "—"}
            </div>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parent Info
          </h3>
          {parent ? (
            <div className="space-y-2 text-gray-700">
              <div className="text-sm font-medium">{parent.parentName}</div>
              {parent.contactNumber && (
                <div className="text-sm">Phone: {parent.contactNumber}</div>
              )}
              {(parent.address || parent.township) && (
                <div className="text-sm">
                  Address: {parent.address || "—"}, {parent.township || ""}
                </div>
              )}
              {parent.religion && (
                <div className="text-sm">Religion: {parent.religion}</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No parent details.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Child Info
          </h3>
          {child ? (
            <div className="space-y-2 text-gray-700">
              <div className="text-sm font-medium">{child.childName}</div>
              {child.gender && (
                <div className="text-sm">Gender: {child.gender}</div>
              )}
              {child.birthDate && (
                <div className="text-sm">
                  Birth Date: {new Date(child.birthDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No child details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
