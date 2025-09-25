// frontend/src/components/TherapyForm.jsx
// Note form with local save using therapyNoteApi mock
// SIHapp styling with amber theme

import React, { useEffect, useState } from "react";
import { createTherapyNote, getTherapyNotes } from "../../api/therapyNoteApi";
import './TherapyForm.css';

export default function TherapyForm({ appointment, practitionerId, onNoteCreated }) {
  const [vitals, setVitals] = useState("");
  const [observations, setObservations] = useState("");
  const [steps, setSteps] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadExisting() {
      if (!appointment?.id) return;
      const notes = await getTherapyNotes({ appointmentId: appointment.id });
      if (!mounted) return;
      if (notes && notes.length > 0) {
        const latest = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setVitals(latest.vitals || "");
        setObservations(latest.observations || "");
        setSteps(latest.steps || "");
        setRecommendations(latest.recommendations || "");
      } else {
        setVitals("");
        setObservations("");
        setSteps("");
        setRecommendations("");
      }
    }
    loadExisting();
    return () => {
      mounted = false;
    };
  }, [appointment?.id]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      appointmentId: appointment?.id,
      practitionerId,
      vitals,
      observations,
      steps,
      recommendations,
    };

    const res = await createTherapyNote(payload);
    setSaving(false);
    if (res?.success) {
      setMessage("Note saved locally (mock).");
      if (onNoteCreated) onNoteCreated(res.note);
    } else {
      setMessage("Failed to save note.");
    }
  }

  return (
    <div className="therapy-form-container">
      <div className="therapy-form-header">
        <h2>Therapy Notes</h2>
        {appointment && (
          <p className="patient-info">
            Patient: <span className="patient-name">{appointment.patientName}</span>
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="therapy-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="vitals">Vitals</label>
            <textarea
              id="vitals"
              value={vitals}
              onChange={(e) => setVitals(e.target.value)}
              placeholder="Blood pressure, pulse, temperature, etc."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observations">Observations</label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Patient condition, symptoms, behavior"
              rows={4}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="steps">Treatment Steps</label>
            <textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Detailed treatment procedures and steps taken"
              rows={6}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="recommendations">Recommendations</label>
            <textarea
              id="recommendations"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Future treatment plan and patient recommendations"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="save-btn">
            {saving ? (
              <>
                <div className="spinner"></div>
                Saving...
              </>
            ) : (
              'Save Notes'
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
