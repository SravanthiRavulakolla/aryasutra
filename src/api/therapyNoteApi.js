// Mock API wrapper for therapy notes matching the future real API contract

const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
const LS_KEY = "therapy_notes_v1";

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveLocal(allNotes) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(allNotes ?? []));
  } catch (e) {
    // ignore in mock mode
  }
}

export async function getTherapyNotes(params = {}) {
  const { practitionerId, appointmentId } = params;
  let notes = loadLocal();
  
  if (practitionerId != null) {
    notes = notes.filter((n) => String(n?.practitionerId ?? "") === String(practitionerId));
  }
  if (appointmentId != null) {
    notes = notes.filter((n) => String(n?.appointmentId ?? "") === String(appointmentId));
  }
  await sleep();
  return notes.map((n) => ({
    id: n?.id ?? Math.random().toString(36).slice(2),
    appointmentId: n?.appointmentId ?? null,
    practitionerId: n?.practitionerId ?? null,
    vitals: n?.vitals ?? "",
    observations: n?.observations ?? "",
    steps: n?.steps ?? "",
    recommendations: n?.recommendations ?? "",
    createdAt: n?.createdAt ?? new Date().toISOString(),
  }));
}

export async function createTherapyNote(payload) {
  const now = new Date().toISOString();
  const note = {
    id: Date.now(),
    createdAt: now,
    ...payload,
  };
  const local = loadLocal();
  local.push(note);
  saveLocal(local);

  await sleep();
  return { success: true, note };
}