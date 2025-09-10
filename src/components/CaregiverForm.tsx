import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { post } from "../lib/api";

export default function CaregiverForm() {
  const navigate = useNavigate();
  const [caregiverName, setCaregiverName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("female");
  const [township, setTownship] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    caregiverName.trim() && contactNumber.trim() && township.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      setError(null);
      await post("/api/v1/caregiver-persona", {
        caregiverName,
        contactNumber,
        gender,
        township,
      });
      // success: go back to caregivers list
      navigate("/caregivers");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create caregiver");
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
          <h2 className="text-2xl font-bold text-gray-900">Add Caregiver</h2>
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
            Caregiver Name<span className="text-red-500">*</span>
          </label>
          <input
            value={caregiverName}
            onChange={(e) => setCaregiverName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number<span className="text-red-500">*</span>
          </label>
          <input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="09xxxxxxx"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Township<span className="text-red-500">*</span>
          </label>
          <input
            value={township}
            onChange={(e) => setTownship(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="YGN"
            required
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
