import { useState } from "react";
import { X, Save, Calendar } from "lucide-react";
import { post } from "../lib/api";
import { toApiDateFromInput, toDateKey } from "../lib/date";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

interface Child {
  _id: string;
  childName: string;
  birthDate: string;
  gender: string;
}

interface ParentBookingFormProps {
  parentId: string;
  parentName: string;
  children: Child[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentBookingForm({
  parentId,
  parentName,
  children,
  onClose,
  onSuccess,
}: ParentBookingFormProps) {
  const [childId, setChildId] = useState("");
  const [dutyDuration, setDutyDuration] = useState("daily");
  const [dutyShift, setDutyShift] = useState("both");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = childId && selectedDates.length > 0;

  const addDate = (date: string) => {
    if (!selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date].sort());
    }
  };

  const removeDate = (date: string) => {
    setSelectedDates(selectedDates.filter((d) => d !== date));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      setError(null);

      // Create bookings for each selected date
      const bookingPromises = selectedDates.map((date) =>
        post("/api/v1/booking", {
          parentInfo: parentId,
          childInfo: childId,
          dutyDuration,
          dutyShift,
          dutyStartingtime: toApiDateFromInput(date),
          additionalNotes,
        })
      );

      await Promise.all(bookingPromises);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create bookings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Booking{selectedDates.length > 1 ? "s" : ""} for {parentName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
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
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.childName}
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
              Select Dates<span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <DatePicker
                format="DD/MM/YYYY"
                disablePast
                value={null}
                onChange={(d) => {
                  if (d) {
                    const dateKey = toDateKey(d.toDate());
                    addDate(dateKey);
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    placeholder: "Click to add dates",
                    InputProps: {
                      readOnly: true,
                    },
                  },
                }}
              />

              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Selected dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center space-x-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-md text-xs"
                      >
                        <Calendar className="h-3 w-3" />
                        <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                        <button
                          type="button"
                          onClick={() => removeDate(date)}
                          className="hover:bg-primary-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting
                ? `Creating ${selectedDates.length} booking${
                    selectedDates.length > 1 ? "s" : ""
                  }...`
                : `Create ${selectedDates.length} booking${
                    selectedDates.length > 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
