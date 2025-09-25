// frontend/src/components/PatientList.jsx
// Left sidebar patient list for the practitioner
// Tailwind CSS used for styling

import React from "react";

export default function PatientList({ patients = [], selectedPatientId, onSelect, onDetails }) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl block mb-2">👥</span>
        <div className="text-sm text-amber-600">No patients found.</div>
        <div className="text-xs text-amber-500 mt-1">Patients will appear here after appointments are made.</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-amber-900">Patient List</h4>
        <span className="text-sm text-amber-600">{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>
      </div>
      
      <ul className="space-y-2 animate-fade-in">
        {patients.map((p, idx) => (
          <li key={p.id} className="animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
            <div className="group flex items-center justify-between rounded-lg border border-amber-200 bg-white hover:border-amber-300 hover:shadow-md transition-all duration-200">
              <button
                type="button"
                className={
                  "flex-1 flex items-center px-3 py-3 text-left text-sm transition-all duration-200 rounded-l-lg " +
                  (String(selectedPatientId) === String(p.id)
                    ? "bg-amber-100 text-amber-900"
                    : "bg-transparent hover:bg-amber-50")
                }
                onClick={() => {
                  if (onSelect) onSelect(p.id);
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-amber-800 font-medium text-sm">
                    {p.name ? p.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                </div>
                <span className="font-medium text-amber-900">{p.name}</span>
              </button>
              
              <button
                type="button"
                className="px-3 py-3 text-xs font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-r-lg transition-all duration-200 border-l border-amber-200"
                onClick={() => {
                  if (onDetails) onDetails(p.id);
                }}
                title="View patient details and history"
              >
                Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
