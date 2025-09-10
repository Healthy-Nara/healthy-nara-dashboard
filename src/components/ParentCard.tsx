import React from "react";
import { MapPin, Phone, Church, Bus, Clock } from "lucide-react";

interface Parent {
  _id: string;
  parentName: string;
  contactNumber: string;
  township: string;
  address: string;
  religion: string;
  nearestBusStop: string;
  durationOfBusStopToHome: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ParentCardProps {
  parent: Parent;
  onView?: () => void;
}

export default function ParentCard({ parent, onView }: ParentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-primary-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {parent.parentName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {parent.parentName}
            </h3>
            <p className="text-sm text-gray-500">
              Parent ID: {parent._id.slice(-8)}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
          Active
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-4 w-4 text-primary-500" />
          <span className="text-sm">{parent.contactNumber}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4 text-secondary-600" />
          <span className="text-sm">
            {parent.address}, {parent.township}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Church className="h-4 w-4 text-primary-600" />
          <span className="text-sm">{parent.religion}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Transportation
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Bus className="h-3 w-3 text-secondary-600" />
              <span className="text-xs text-gray-600">
                {parent.nearestBusStop}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-primary-600" />
              <span className="text-xs text-gray-600">
                {parent.durationOfBusStopToHome}
              </span>
            </div>
          </div>
        </div>
      </div>

      {parent.createdAt && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Registered: {new Date(parent.createdAt).toLocaleDateString()}
          </p>
          {onView && (
            <button
              onClick={onView}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  );
}
