import { useEffect, useMemo, useState } from "react";
import { get } from "../lib/api";
import { formatDisplayDate, toDateKey } from "../lib/date";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { RefreshCw } from "lucide-react";

interface AssignmentItem {
  _id: string;
  bookingId:
    | {
        _id: string;
        dutyDuration: string;
        dutyShift: string;
        dutyStartingtime: string;
        additionalNotes?: string;
      }
    | string;
  caregiverInfo: { _id: string; caregiverName: string } | string;
  childInfo: { _id: string; childName: string } | string;
  parentInfo: { _id: string; parentName: string } | string;
  dutyAssignDate: string;
  careGiverStatus?: string;
}

export default function Duties() {
  const [items, setItems] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await get<any>("/api/v1/duty-assign");
      if (!res || !Array.isArray(res.data)) throw new Error("Invalid response");
      setItems(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!dateFilter) return items;
    return items.filter((a) => toDateKey(a.dutyAssignDate) === dateFilter);
  }, [items, dateFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Duties</h2>
          <p className="text-gray-600">All duty assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-48">
            <DatePicker
              format="DD/MM/YYYY"
              value={dateFilter ? dayjs(dateFilter) : null}
              onChange={(d) => setDateFilter(d ? toDateKey(d.toDate()) : "")}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
            <p className="text-gray-600">Loading duties...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={load}
            className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No duties found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-4">Assign Date</th>
                  <th className="py-3 px-4">Parent</th>
                  <th className="py-3 px-4">Child</th>
                  <th className="py-3 px-4">Caregiver</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => (window.location.href = `/duties/${a._id}`)}
                  >
                    <td className="py-5 px-4">
                      {formatDisplayDate(a.dutyAssignDate)}
                    </td>
                    <td className="py-5 px-4">
                      {typeof a.parentInfo === "string"
                        ? a.parentInfo
                        : a.parentInfo?.parentName || "—"}
                    </td>
                    <td className="py-5 px-4">
                      {typeof a.childInfo === "string"
                        ? a.childInfo
                        : a.childInfo?.childName || "—"}
                    </td>
                    <td className="py-5 px-4">
                      {typeof a.caregiverInfo === "string"
                        ? a.caregiverInfo
                        : a.caregiverInfo?.caregiverName || "—"}
                    </td>
                    <td className="py-5 px-4">
                      {typeof a.bookingId === "string"
                        ? "—"
                        : `${a.bookingId?.dutyDuration || ""}
                        `}
                    </td>
                    <td className="py-5 px-4">
                      {typeof a.bookingId === "string"
                        ? "—"
                        : `${a.bookingId?.dutyShift || ""}
                        `}
                    </td>
                    <td className="py-5 px-4 capitalize">
                      {a.careGiverStatus?.replace("-", " ") || "—"}
                    </td>
                    <td className="py-5 px-4">
                      <button
                        onClick={() =>
                          (window.location.href = `/duties/${a._id}`)
                        }
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
