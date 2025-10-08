import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Calendar,
  Clock,
  Users,
  Plus,
  X,
  CloudMoon,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get } from "../lib/api";
import { formatDisplayDate, toDateKey } from "../lib/date";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

interface BookingItem {
  _id: string;
  parentInfo: { _id: string; parentName: string };
  childInfo: { _id: string; childName: string };
  dutyDuration: string;
  dutyShift: string;
  dutyStartingtime: string;
  additionalNotes?: string;
  bookingStatus: string;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case "assigned":
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const dateKey = (iso: string) => toDateKey(iso);

  const todayKey = useMemo(() => toDateKey(new Date()), []);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-primary-600 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {b.parentInfo?.parentName || "Parent"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {b.childInfo?.childName || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-secondary-600 mr-2" />
                        <div className="text-sm text-gray-900">
                          {formatDisplayDate(b.dutyStartingtime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-primary-600 mr-2" />
                        <div className="text-sm text-gray-900 capitalize">
                          {b.dutyDuration}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CloudMoon className="h-4 w-4 text-primary-600 mr-2" />
                        <div className="text-sm text-gray-900 capitalize">
                          {b.dutyShift}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(b.bookingStatus)}
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            b.bookingStatus
                          )}`}
                        >
                          {b.bookingStatus.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/appointments/${b._id}`)}
                        className="text-primary-600 hover:text-primary-900 px-3 py-1.5 text-xs font-medium rounded-md bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        View Details
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
