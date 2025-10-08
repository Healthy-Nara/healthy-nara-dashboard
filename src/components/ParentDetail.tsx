import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Church,
  Bus,
  Clock,
  Users,
  Plus,
  Calendar,
  X,
  Check,
  AlertCircle,
  Trash2,
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

interface BookingItem {
  _id: string;
  parentInfo: { _id: string; parentName: string };
  childInfo: { _id: string; childName: string };
  caregiverInfo?: { _id: string; caregiverName: string };
  dutyDuration: string;
  dutyShift: string;
  dutyStartingtime: string;
  additionalNotes?: string;
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: ParentDetailData;
}

import { useNavigate, useParams } from "react-router-dom";
import { get, del } from "../lib/api";
import { formatDisplayDate, toDateKey } from "../lib/date";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import ParentBookingForm from "./ParentBookingForm";

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
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [dutyAssignments, setDutyAssignments] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadBookings = async () => {
    if (!effectiveId) return;
    try {
      setBookingsLoading(true);
      const { data: json } = await get("/api/v1/booking");
      console.log("All bookings response:", json);
      if (json && Array.isArray(json.data)) {
        const parentBookings = json.data.filter(
          (booking: BookingItem) => booking.parentInfo._id === effectiveId
        );
        console.log("Parent bookings:", parentBookings);
        // Log each booking to see the structure
        parentBookings.forEach((booking: any, index: number) => {
          console.log(`Booking ${index}:`, booking);
          console.log(`Booking ${index} caregiverInfo:`, booking.caregiverInfo);
          console.log(
            `Booking ${index} caregiver:`,
            (booking as any).caregiver
          );
          console.log(
            `Booking ${index} assignedCaregiver:`,
            (booking as any).assignedCaregiver
          );
          console.log(
            `Booking ${index} caregiverId:`,
            (booking as any).caregiverId
          );
          console.log(`Booking ${index} all keys:`, Object.keys(booking));
        });
        setBookings(parentBookings);
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadDutyAssignments = async () => {
    try {
      const { data: res } = await get<any>("/api/v1/duty-assign");
      console.log("Duty assignments response:", res);
      if (Array.isArray(res?.data)) {
        setDutyAssignments(res.data);
        console.log("Loaded duty assignments:", res.data.length);
      }
    } catch (e) {
      console.error("Failed to load duty assignments:", e);
    }
  };

  const handleDelete = async () => {
    if (!effectiveId) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await del(`/api/v1/parent/${effectiveId}`);
      navigate("/parents");
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ||
          (e instanceof Error ? e.message : "Failed to delete parent")
      );
    } finally {
      setDeleting(false);
    }
  };

  const getBookingAssignment = (bookingId: string) => {
    return dutyAssignments.find((assignment) => {
      const assignmentBookingId =
        typeof assignment.bookingId === "string"
          ? assignment.bookingId
          : assignment.bookingId?._id;
      return assignmentBookingId === bookingId;
    });
  };

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
    loadBookings();
    loadDutyAssignments();
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBookingForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Booking</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Parent</span>
          </button>
          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
            {data.parentName.charAt(0)}
          </div>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
          <div className="flex items-center space-x-3">
            <div className="w-48">
              <DatePicker
                format="DD/MM/YYYY"
                value={dateFilter ? dayjs(dateFilter) : null}
                onChange={(d) => setDateFilter(d ? toDateKey(d.toDate()) : "")}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </div>
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                title="Clear date filter"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-500">
              Loading bookings...
            </div>
          </div>
        ) : (
          <>
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-600">No bookings found.</p>
            ) : (
              <div className="space-y-3">
                {bookings
                  .filter((booking) =>
                    dateFilter
                      ? toDateKey(booking.dutyStartingtime) === dateFilter
                      : true
                  )
                  .map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            {/* <p className="text-sm font-medium text-gray-900">
                              {booking.childInfo?.childName || "—"}
                            </p> */}
                            <p className="text-md text-gray-600">
                              {formatDisplayDate(booking.dutyStartingtime)} •{" "}
                              {booking.dutyDuration} • {booking.dutyShift}
                            </p>

                            {/* Duty Assignment Status */}
                            <div className="flex items-center space-x-1 mt-1">
                              {(() => {
                                const assignment = getBookingAssignment(
                                  booking._id
                                );

                                console.log(
                                  `Rendering booking ${booking._id}:`,
                                  {
                                    assignment,
                                    hasAssignment: !!assignment,
                                    caregiverInfo: assignment?.caregiverInfo,
                                    caregiverName:
                                      assignment?.caregiverInfo?.caregiverName,
                                  }
                                );

                                return assignment ? (
                                  <>
                                    <Check className="h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">
                                      Duty Assigned
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      to{" "}
                                      {assignment.caregiverInfo
                                        ?.caregiverName ||
                                        assignment.caregiverInfo?.name ||
                                        "Unknown"}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 text-orange-500" />
                                    <span className="text-xs text-orange-600 font-medium">
                                      Duty Not Assigned
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">
                              {booking.additionalNotes && (
                                <span className="block truncate max-w-32">
                                  {booking.additionalNotes}
                                </span>
                              )}
                            </p>
                            <button
                              onClick={() =>
                                navigate(`/appointments/${booking._id}`)
                              }
                              className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {showBookingForm && data && (
        <ParentBookingForm
          parentId={data._id}
          parentName={data.parentName}
          children={data.children}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            loadBookings();
            setShowBookingForm(false);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Parent
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this parent? This action cannot be
              undone and will also delete all associated bookings and
              assignments.
            </p>
            {deleteError && (
              <p className="text-sm text-red-600 mb-4">{deleteError}</p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
