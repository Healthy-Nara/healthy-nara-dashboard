import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../lib/api";
import { toApiDateFromInput, toDateKey } from "../lib/date";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

interface ParentOption {
  _id: string;
  parentName: string;
}
interface ChildOption {
  _id: string;
  childName: string;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const [parents, setParents] = useState<ParentOption[]>([]);
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [parentId, setParentId] = useState("");
  const [childId, setChildId] = useState("");
  const [dutyDuration, setDutyDuration] = useState("daily");
  const [dutyShift, setDutyShift] = useState("both");
  const [dutyStartingtime, setDutyStartingtime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = parentId && childId && dutyStartingtime;

  const loadChildren = async (id: string) => {
    console.log(parentId);
    // There is no provided children list API; derive from parents endpoint children arrays if present
    try {
      const { data: json } = await get(`/api/v1/parent/${id}`);

      // console.log("children", json);

      setChildren(json?.data?.children);
    } catch (_) {
      setChildren([]);
    }
  };

  console.log(children);

  useEffect(() => {
    const loadParents = async () => {
      const { data: json } = await get("/api/v1/parent");
      // console.log(json);
      setParents(
        json?.data?.parentPersona?.map((p: any) => ({
          _id: p._id,
          parentName: p.parentName,
        })) || []
      );
    };

    loadParents();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      setError(null);
      await post("/api/v1/booking", {
        parentInfo: parentId,
        childInfo: childId,
        dutyDuration,
        dutyShift,
        dutyStartingtime: toApiDateFromInput(dutyStartingtime),
        additionalNotes,
      });
      navigate("/appointments");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Add Booking</h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent<span className="text-red-500">*</span>
          </label>
          <select
            value={parentId}
            onChange={(e) => {
              setParentId(e.target.value);
              loadChildren(e.target.value);
              1;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="" disabled>
              Select Parent
            </option>
            {parents.map((p) => (
              <option key={p._id} value={p._id}>
                {p.parentName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child<span className="text-red-500">*</span>
          </label>
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="" disabled>
              Select Child
            </option>
            {children.map((c) => (
              <option key={c._id} value={c._id}>
                {c.childName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={dutyDuration}
              onChange={(e) => setDutyDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>
            <select
              value={dutyShift}
              onChange={(e) => setDutyShift(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date<span className="text-red-500">*</span>
          </label>
          <DatePicker
            format="DD/MM/YYYY"
            disablePast
            value={dutyStartingtime ? dayjs(dutyStartingtime) : null}
            onChange={(d) =>
              setDutyStartingtime(d ? toDateKey(d.toDate()) : "")
            }
            slotProps={{
              textField: { size: "small", fullWidth: true, required: true },
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="Any additional notes"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="inline-flex items-center px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
