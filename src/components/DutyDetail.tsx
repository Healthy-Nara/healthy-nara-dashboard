import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../lib/api";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Baby,
  UserCircle2,
  Info,
} from "lucide-react";
import { formatDisplayDate } from "../lib/date";

interface AssignmentItem {
  _id: string;
  bookingId: any;
  caregiverInfo: any;
  childInfo: any;
  parentInfo: any;
  dutyAssignDate: string;
  careGiverStatus?: string;
  createdAt?: string;
}

export default function DutyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<AssignmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [parent, setParent] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [caregiver, setCaregiver] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);

  const parentId = useMemo(() => {
    if (!assignment) return "";
    return typeof assignment.parentInfo === "string"
      ? assignment.parentInfo
      : assignment.parentInfo?._id;
  }, [assignment]);

  const childId = useMemo(() => {
    if (!assignment) return "";
    return typeof assignment.childInfo === "string"
      ? assignment.childInfo
      : assignment.childInfo?._id;
  }, [assignment]);

  const caregiverId = useMemo(() => {
    if (!assignment) return "";
    return typeof assignment.caregiverInfo === "string"
      ? assignment.caregiverInfo
      : assignment.caregiverInfo?._id;
  }, [assignment]);

  const bookingId = useMemo(() => {
    if (!assignment) return "";
    return typeof assignment.bookingId === "string"
      ? assignment.bookingId
      : assignment.bookingId?._id;
  }, [assignment]);

  useEffect(() => {
    const loadAssignment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        // Try detail endpoint first
        let found: any | null = null;
        try {
          const { data: res } = await get<any>(`/api/v1/duty-assign/${id}`);
          if (res?.data) found = res.data;
        } catch (_) {
          // Fallback to list and find
          const { data: listRes } = await get<any>(`/api/v1/duty-assign`);
          const all = Array.isArray(listRes?.data) ? listRes.data : [];
          found = all.find((a: any) => a._id === id) || null;
        }
        if (!found) throw new Error("Assignment not found");
        setAssignment(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    loadAssignment();
  }, [id]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        // Parent (also used to optionally derive child)
        if (parentId) {
          const { data: pres } = await get<any>(`/api/v1/parent/${parentId}`);
          setParent(pres?.data || null);
          if (!child && childId) {
            const fromParent = pres?.data?.children?.find(
              (c: any) => c._id === childId
            );
            if (fromParent) setChild(fromParent);
          }
        }

        // Child direct endpoint (fallback if not resolved above)
        if (!child && childId) {
          try {
            const { data: cres } = await get<any>(`/api/v1/child/${childId}`);
            if (cres?.data) setChild(cres.data);
          } catch (_) {}
        }

        // Caregiver
        if (caregiverId) {
          try {
            const { data: cg } = await get<any>(
              `/api/v1/caregiver-persona/${caregiverId}`
            );
            setCaregiver(cg?.data || null);
          } catch (_) {}
        }

        // Booking (no detail endpoint used elsewhere; fallback to list)
        if (bookingId) {
          try {
            const { data: bres } = await get<any>(
              `/api/v1/booking/${bookingId}`
            );
            if (bres?.data) setBooking(bres.data);
          } catch (_) {
            const { data: all } = await get<any>(`/api/v1/booking`);
            const item =
              (all?.data || []).find((b: any) => b._id === bookingId) || null;
            setBooking(item);
          }
        }
      } catch (_) {
        // ignore partial failures, UI will show what is available
      }
    };
    if (assignment) loadRelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, parentId, childId, caregiverId, bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-600">
        Loading...
      </div>
    );
  }

  if (error || !assignment) {
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

  const displayBooking = booking || assignment.bookingId;

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
          <h2 className="text-2xl font-bold text-gray-900">Duty Detail</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assignment Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-secondary-600" />
              <span className="text-sm">
                {formatDisplayDate(assignment.dutyAssignDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary-600" />
              <span className="text-sm capitalize">
                {displayBooking?.dutyDuration || "—"} •{" "}
                {displayBooking?.dutyShift || "—"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-gray-500" />
              <span className="text-sm capitalize">
                {assignment.careGiverStatus?.replace("-", " ") || "not-started"}
              </span>
            </div>
          </div>
          {displayBooking?.dutyStartingtime && (
            <p className="text-sm text-gray-700 mt-2">
              Start: {formatDisplayDate(displayBooking.dutyStartingtime)}
            </p>
          )}
          {displayBooking?.additionalNotes && (
            <p className="text-sm text-gray-700 mt-1">
              Notes: {displayBooking.additionalNotes}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parent Info
          </h3>
          {parent ? (
            <div className="space-y-2 text-gray-700">
              <div className="text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4 text-primary-600" />
                <span>{parent.parentName}</span>
              </div>
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
              <div className="text-sm font-medium flex items-center space-x-2">
                <Baby className="h-4 w-4 text-secondary-600" />
                <span>{child.childName}</span>
              </div>
              {child.gender && (
                <div className="text-sm">Gender: {child.gender}</div>
              )}
              {child.birthDate && (
                <div className="text-sm">
                  Birth Date: {formatDisplayDate(child.birthDate)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No child details.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Caregiver Info
          </h3>
          {caregiver ? (
            <div className="space-y-2 text-gray-700">
              <div className="text-sm font-medium flex items-center space-x-2">
                <UserCircle2 className="h-4 w-4 text-primary-600" />
                <span>{caregiver.caregiverName}</span>
              </div>
              {caregiver.contactNumber && (
                <div className="text-sm">Phone: {caregiver.contactNumber}</div>
              )}
              {(caregiver.address || caregiver.township) && (
                <div className="text-sm">
                  Address: {caregiver.address || "—"},{" "}
                  {caregiver.township || ""}
                </div>
              )}
              {caregiver.gender && (
                <div className="text-sm capitalize">
                  Gender: {caregiver.gender}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No caregiver details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
