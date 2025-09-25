// frontend/src/components/ResourceUpload.jsx
// Mock resource upload (local only) + list display
// SIHapp styling with amber theme

import React, { useEffect, useState } from "react";
import './ResourceUpload.css';

const LS_PREFIX = "resources_v1_";

// Mock resources data
const mockResources = [
  {
    id: 1,
    title: "Panchakarma Treatment Guidelines",
    fileName: "panchakarma_guide.pdf",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Herbal Medicine Reference",
    fileName: "herbal_medicines.pdf",
    createdAt: "2024-01-10T14:20:00Z"
  }
];

export default function ResourceUpload({ practitionerId }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const lsKey = `${LS_PREFIX}${practitionerId ?? "unknown"}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      const local = raw ? JSON.parse(raw) : [];
      setItems([...mockResources, ...(Array.isArray(local) ? local : [])]);
    } catch (e) {
      setItems(mockResources);
    }
  }, [lsKey]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    // Simulate upload and save to localStorage
    const resource = {
      id: Date.now(),
      practitionerId,
      title: title || (file ? file.name : "Untitled"),
      fileName: file ? file.name : undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(lsKey);
      const local = raw ? JSON.parse(raw) : [];
      local.push(resource);
      localStorage.setItem(lsKey, JSON.stringify(local));
      setItems((prev) => [resource, ...prev]);
      setTitle("");
      setFile(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="resource-upload-container">
      <div className="upload-form-section">
        <h3>Upload Resource</h3>
        
        <form onSubmit={onSubmit} className="upload-form">
          <div className="form-field">
            <input
              type="text"
              className="title-input"
              placeholder="Resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-field">
            <input
              type="file"
              className="file-input"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          
          <button
            type="submit"
            className="upload-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                Uploading...
              </>
            ) : (
              'Upload Resource'
            )}
          </button>
        </form>
      </div>

      <div className="resources-list-section">
        <h4>My Resources</h4>
        {items.length === 0 ? (
          <div className="no-resources">No resources yet.</div>
        ) : (
          <ul className="resources-list">
            {items.map((r, idx) => (
              <li key={r.id} className="resource-item" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="resource-title">{r.title}</div>
                <div className="resource-filename">{r.fileName || "(mock)"}</div>
                <div className="resource-date">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}