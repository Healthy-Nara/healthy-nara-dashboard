import React, { useState, useEffect } from "react";

interface Caregiver {
  _id: string;
  name: string;
  NRC: string;
  createdAt: string;
  __v: number;
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: Caregiver[];
}

const TermsAndConditions: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://api.healthynara.com/api/v1/term-and-condition",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.status === "success" && data.data) {
          setCaregivers(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch caregivers");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data",
        );
        console.error("Error fetching caregivers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Loading caregivers...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Terms and Conditions
        </h1>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Welcome to HealthyNara. By using our services, you agree to comply
            with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            1. Caregiver Services
          </h2>
          <p className="mb-4">
            Our platform connects families with qualified caregivers. All
            caregivers listed below have been verified and are part of our
            trusted network.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            2. User Responsibilities
          </h2>
          <p className="mb-4">
            Users must provide accurate information and treat all caregivers
            with respect and professionalism.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            3. Privacy and Data Protection
          </h2>
          <p className="mb-4">
            We are committed to protecting your personal information and
            maintaining your privacy.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
            4. Service Fees
          </h2>
          <p className="mb-4">
            Service fees are clearly communicated before booking. No hidden
            charges will be applied.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Verified Caregivers
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NRC Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {caregivers.map((caregiver, index) => (
                <tr key={caregiver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {caregiver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {caregiver.NRC}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(caregiver.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Total Caregivers: {caregivers.length}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
