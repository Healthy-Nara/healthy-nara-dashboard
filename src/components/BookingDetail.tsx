import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, del } from "../lib/api";
import { ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react";
import { formatDisplayDate, toApiDateFromInput, toDateKey } from "../lib/date";
import { DatePicker } from "@mui/x-date-pickers";

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

interface CaregiverItem {
  _id: string;
  caregiverName: string;
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [parent, setParent] = useState<ParentData | null>(null);
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<CaregiverItem[]>([]);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState("");
  const [assignDate, setAssignDate] = useState(toDateKey(new Date()));
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteAssignConfirm, setShowDeleteAssignConfirm] = useState(false);
  const [deletingAssign, setDeletingAssign] = useState(false);
  const [deleteAssignError, setDeleteAssignError] = useState<string | null>(
    null
  );
  const [selectedAssignId, setSelectedAssignId] = useState<string | null>(null);
  console.log("assignDate", booking);

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

  useEffect(() => {
    const loadCaregivers = async () => {
      try {
        const { data: res } = await get<any>("/api/v1/caregiver-persona");
        if (Array.isArray(res?.data)) setCaregivers(res.data);
      } catch (e) {
        // ignore silently for this auxiliary list
      }
    };
    loadCaregivers();
  }, []);

  const loadAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      setAssignmentsError(null);
      const { data: res } = await get<any>("/api/v1/duty-assign");
      // console.log(res);
      const all = Array.isArray(res?.data) ? res.data : [];
      const filtered = booking
        ? all.filter((a: any) => {
            const idVal =
              typeof a.bookingId === "string" ? a.bookingId : a.bookingId?._id;
            return idVal === booking._id;
          })
        : [];
      setAssignments(filtered);
    } catch (e) {
      setAssignmentsError(
        e instanceof Error ? e.message : "Failed to load assignments"
      );
    } finally {
      setAssignmentsLoading(false);
    }
  };

  useEffect(() => {
    if (booking?._id) {
      loadAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?._id]);

  const handleAssign = async () => {
    if (!booking || !selectedCaregiverId || !assignDate) return;
    setAssignError(null);
    setAssignSuccess(null);
    // Prevent duplicate: same caregiver + same date for this booking
    const exists = assignments.some((a) => {
      const aBookingId =
        typeof a.bookingId === "string" ? a.bookingId : a.bookingId?._id;
      const aCareId =
        typeof a.caregiverInfo === "string"
          ? a.caregiverInfo
          : a.caregiverInfo?._id;
      const aDateKey = toDateKey(a.dutyAssignDate);
      return (
        aBookingId === booking._id &&
        aCareId === selectedCaregiverId &&
        aDateKey === assignDate
      );
    });
    if (exists) {
      setAssignError(
        "This caregiver is already assigned for the selected date."
      );
      return;
    }
    try {
      setAssigning(true);
      const parentId =
        typeof booking.parentInfo === "string"
          ? booking.parentInfo
          : booking.parentInfo?._id;
      const childId =
        typeof booking.childInfo === "string"
          ? booking.childInfo
          : booking.childInfo?._id;

      await post("/api/v1/duty-assign", {
        bookingId: booking._id,
        caregiverInfo: selectedCaregiverId,
        childInfo: childId,
        parentInfo: parentId,
        dutyAssignDate: toApiDateFromInput(assignDate),
      });
      setAssignSuccess("Duty assigned successfully.");
      await loadAssignments();
    } catch (e: any) {
      setAssignError(
        e?.response?.data?.message ||
          (e instanceof Error ? e.message : "Failed to assign duty")
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async () => {
    if (!booking?._id) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await del(`/api/v1/booking/${booking._id}`);
      navigate(-1);
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ||
          (e instanceof Error ? e.message : "Failed to delete booking")
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!selectedAssignId) return;
    try {
      setDeletingAssign(true);
      setDeleteAssignError(null);
      await del(`/api/v1/duty-assign/${selectedAssignId}`);
      setShowDeleteAssignConfirm(false);
      setSelectedAssignId(null);
      await loadAssignments();
    } catch (e: any) {
      setDeleteAssignError(
        e?.response?.data?.message ||
          (e instanceof Error ? e.message : "Failed to delete assignment")
      );
    } finally {
      setDeletingAssign(false);
    }
  };

  //  console.log(parent);
  //   console.log(childId);
  // console.log(child);

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
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Booking</span>
        </button>
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
                {formatDisplayDate(booking.dutyStartingtime)}
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
                  Birth Date: {formatDisplayDate(child.birthDate)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No child details.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Assign Duty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Caregiver
            </label>
            <select
              value={selectedCaregiverId}
              onChange={(e) => setSelectedCaregiverId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select caregiver</option>
              {caregivers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.caregiverName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Date</label>
            <DatePicker
              format="DD/MM/YYYY"
              // value={dayjs(toDateKey(booking.dutyStartingtime))}
              onChange={(d) =>
                setAssignDate(toDateKey(d?.toDate() || new Date()))
              }
              disablePast
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAssign}
              disabled={!selectedCaregiverId || !assignDate || assigning}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
        {assignError && (
          <p className="mt-3 text-sm text-red-600">{assignError}</p>
        )}
        {assignSuccess && (
          <p className="mt-3 text-sm text-green-600">{assignSuccess}</p>
        )}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-2">
            Assignments
          </h4>
          {assignmentsLoading ? (
            <p className="text-sm text-gray-600">Loading assignments...</p>
          ) : assignmentsError ? (
            <p className="text-sm text-red-600">{assignmentsError}</p>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-gray-600">No assignments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Caregiver</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a._id} className="border-t border-gray-100">
                      <td className="py-2 pr-4">
                        {formatDisplayDate(a.dutyAssignDate)}
                      </td>
                      <td className="py-2 pr-4">
                        {typeof a.caregiverInfo === "string"
                          ? a.caregiverInfo
                          : a.caregiverInfo?.caregiverName || "—"}
                      </td>
                      <td className="py-2 pr-4 capitalize">
                        {a.careGiverStatus?.replace("-", " ") || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          onClick={() => {
                            setSelectedAssignId(a._id);
                            setShowDeleteAssignConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Booking
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this booking? This action cannot
              be undone.
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

      {showDeleteAssignConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Assignment
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this duty assignment? This action
              cannot be undone.
            </p>
            {deleteAssignError && (
              <p className="text-sm text-red-600 mb-4">{deleteAssignError}</p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteAssignConfirm(false);
                  setSelectedAssignId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={deletingAssign}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssignment}
                disabled={deletingAssign}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingAssign ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
