// frontend/src/components/PatientHistory.jsx
// Slide-over drawer showing patient's history: appointments, therapy notes, feedback
// SIHapp styling with amber theme

import React, { useMemo } from "react";
import './PatientHistory.css';

function Section({ title, children }) {
  return (
    <section className="history-section">
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

export default function PatientHistory({ open, onClose, patient, appointments = [], therapyNotes = [], feedback = [] }) {
  const [therapyFilter, setTherapyFilter] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const filteredAppts = useMemo(() => {
    let list = appointments.slice();
    if (therapyFilter) list = list.filter((a) => a.therapy === therapyFilter);
    if (from) list = list.filter((a) => new Date(a.date) >= new Date(from));
    if (to) list = list.filter((a) => new Date(a.date) <= new Date(to));
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, therapyFilter, from, to]);

  const notesByAppt = useMemo(() => {
    const m = new Map();
    for (const n of therapyNotes) {
      const k = String(n.appointmentId ?? "");
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(n);
    }
    for (const [, arr] of m) arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return m;
  }, [therapyNotes]);

  if (!open) return null;

  return (
    <div className="patient-history-overlay">
      {/* Backdrop */}
      <div className="backdrop" onClick={onClose} />
      
      {/* Panel */}
      <div className="history-panel">
        {/* Header */}
        <div className="panel-header">
          <div className="patient-info">
            <div className="patient-label">Patient</div>
            <div className="patient-name">{patient?.name ?? "—"}</div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <span className="close-icon">×</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="panel-content">
          {/* Filters */}
          <div className="filters-grid">
            <select
              className="filter-select"
              value={therapyFilter}
              onChange={(e) => setTherapyFilter(e.target.value)}
            >
              <option value="">All therapies</option>
              {[...new Set(appointments.map((a) => a.therapy))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            
            <input
              type="date"
              className="filter-date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From date"
            />
            
            <input
              type="date"
              className="filter-date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To date"
            />
          </div>

          <Section title="Appointments">
            {filteredAppts.length === 0 ? (
              <div className="no-data">No appointments.</div>
            ) : (
              <ul className="appointments-list">
                {filteredAppts.map((a) => (
                  <li key={a.id} className="appointment-item">
                    <div className="appointment-header">
                      <span className="appointment-icon">📅</span>
                      <span className="appointment-date">{new Date(a.date).toLocaleString()}</span>
                    </div>
                    <div className="appointment-therapy">Therapy: {a.therapy}</div>
                    
                    <div className="notes-section">
                      {(notesByAppt.get(String(a.id)) || []).length === 0 ? (
                        <div className="no-notes">No notes.</div>
                      ) : (
                        <ul className="notes-list">
                          {(notesByAppt.get(String(a.id)) || []).map((n) => (
                            <li key={n.id} className="note-item">
                              <div className="note-header">
                                <span className="note-icon">📋</span>
                                <span className="note-date">{new Date(n.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="note-content">
                                <div className="note-vitals">
                                  <span className="note-label">Vitals:</span> {n.vitals || "—"}
                                </div>
                                {n.observations && (
                                  <div className="note-observations">{n.observations}</div>
                                )}
                                {n.recommendations && (
                                  <div className="note-recommendations">{n.recommendations}</div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Feedback">
            {feedback.length === 0 ? (
              <div className="no-data">No feedback yet.</div>
            ) : (
              <ul className="feedback-list">
                {feedback.map((f) => (
                  <li key={f.id} className="feedback-item">
                    <div className="feedback-appointment">Appointment #{f.appointmentId}</div>
                    {f.symptom && (
                      <div className="feedback-symptom">
                        <span className="feedback-label">Symptom:</span> {f.symptom}
                      </div>
                    )}
                    {f.notes && <div className="feedback-notes">{f.notes}</div>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
