import { useEffect, useMemo, useState } from "react";
import { Users, Calendar, TrendingUp, Star, Clock } from "lucide-react";
import { get } from "../lib/api";
import { toDateKey } from "../lib/date";

export default function Dashboard() {
  const [parentsCount, setParentsCount] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [parentsRes, bookingsRes, assignmentsRes] = await Promise.all([
          get<any>("/api/v1/parent"),
          get<any>("/api/v1/booking"),
          get<any>("/api/v1/duty-assign"),
        ]);
        setParentsCount(parentsRes?.data?.data?.parentPersona?.length || 0);
        setBookings(bookingsRes?.data?.data || []);
        setAssignments(
          assignmentsRes?.data?.data || assignmentsRes?.data || []
        );
      } finally {
      }
    };
    load();
  }, []);

  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const todayBookings = useMemo(
    () =>
      bookings.filter((b) => toDateKey(b.dutyStartingtime) === todayKey).length,
    [bookings, todayKey]
  );
  const todayAssignments = useMemo(
    () =>
      (assignments || []).filter(
        (a) => toDateKey(a.dutyAssignDate) === todayKey
      ).length,
    [assignments, todayKey]
  );
  const totalBookings = bookings.length;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to HealthyNara Dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Parents</p>
              <p className="text-2xl font-bold">{parentsCount}</p>
              <p className="text-primary-200 text-xs">as of today</p>
            </div>
            <Users className="h-8 w-8 text-primary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm">Today's Duty Assign</p>
              <p className="text-2xl font-bold">{todayAssignments}</p>
              <p className="text-secondary-200 text-xs">assignments today</p>
            </div>
            <Clock className="h-8 w-8 text-secondary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Today's Bookings</p>
              <p className="text-2xl font-bold">{todayBookings}</p>
              <p className="text-secondary-100 text-xs">bookings today</p>
            </div>
            <Calendar className="h-8 w-8 text-secondary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-50 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
              <p className="text-secondary-50 text-xs">all time</p>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary-100" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New parent registered
                </p>
                <p className="text-xs text-gray-500">
                  Aung Thuyein Hein joined 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
              <Calendar className="h-5 w-5 text-secondary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Appointment scheduled
                </p>
                <p className="text-xs text-gray-500">
                  Care session for tomorrow at 2:00 PM
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
              <Star className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New review received
                </p>
                <p className="text-xs text-gray-500">
                  5-star rating from Kyaw Kyaw
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
              <Users className="h-6 w-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Parent</p>
              <p className="text-xs text-gray-500">Register new family</p>
            </button>
            <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors text-left">
              <Calendar className="h-6 w-6 text-secondary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Schedule</p>
              <p className="text-xs text-gray-500">Book appointment</p>
            </button>
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
              <TrendingUp className="h-6 w-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500">View reports</p>
            </button>
            <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors text-left">
              <Clock className="h-6 w-6 text-secondary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Today's Plan</p>
              <p className="text-xs text-gray-500">View schedule</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
