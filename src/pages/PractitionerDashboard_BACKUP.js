import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from '../context/AuthContext';
import PatientList from '../components/practitioner/PatientList';
import AppointmentList from '../components/practitioner/AppointmentList';
import TherapyForm from '../components/practitioner/TherapyForm';
import ResourceUpload from '../components/practitioner/ResourceUpload';
import PatientHistory from '../components/practitioner/PatientHistory';
import SeasonalIntelligence from '../components/practitioner/SeasonalIntelligence';
import { CalendarIcon, ClipboardDocumentCheckIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// TODO: replace PRACTITIONER_ID with AuthContext user id
const PRACTITIONER_ID = 4;

function listFromModule(mod, preferredKeys = ["users", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

const PractitionerDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [therapyNotes, setTherapyNotes] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentFilter, setRecentFilter] = useState("today");

  // Helpers
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  // Mock user data
  const users = useMemo(() => [
    { id: 1, name: 'Esha Gupta' },
    { id: 2, name: 'Vikram Singh' },
    { id: 3, name: 'Bob Verma' },
    { id: 4, name: 'Rahul Kapoor' },
    { id: 5, name: 'Priya Nair' }
  ], []);
  const userIndex = useMemo(() => new Map(users.map((u) => [String(u.id ?? u._id), u])), [users]);

  // Load appointments data
  const loadAppointments = () => {
    try {
      // Mock appointment data with today's dates
      const today = new Date();
      const mockAppointments = [
        { id: 101, patientName: 'Esha Gupta', patientId: 1, therapy: 'Kizhi', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID },
        { id: 102, patientName: 'Vikram Singh', patientId: 2, therapy: 'Udwarthanam', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID },
        { id: 103, patientName: 'Bob Verma', patientId: 3, therapy: 'Shirodhara', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 30).toISOString(), status: 'pending', practitionerId: PRACTITIONER_ID },
        { id: 104, patientName: 'Rahul Kapoor', patientId: 4, therapy: 'Abhyanga', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID }
      ];
      
      // Load patient bookings from localStorage
      const patientBookings = JSON.parse(localStorage.getItem('practitionerAppointments') || '[]');
      console.log('Loading patient bookings:', patientBookings); // Debug log
      
      // Convert patient bookings to appointment format
      const convertedBookings = patientBookings.map(booking => {
        try {
          // Parse date more reliably
          let bookingDate;
          if (booking.date && booking.time) {
            // Create date string in format: 2024-09-23 9:00 AM
            const dateTimeString = `${booking.date} ${booking.time}`;
            bookingDate = new Date(dateTimeString);
            
            // If invalid, try alternative parsing
            if (isNaN(bookingDate.getTime())) {
              const isoTimeString = convertTimeToISO(booking.time);
              bookingDate = new Date(`${booking.date}T${isoTimeString}`);
            }
          } else {
            bookingDate = new Date(); // Default to now if date/time missing
          }
        
          return {
            id: booking.id,
            patientName: booking.patientName || 'Unknown Patient',
            patientId: booking.patientId || Math.random().toString(36).substr(2, 9),
            patientPhone: booking.patientPhone,
            patientEmail: booking.patientEmail,
            therapy: booking.therapyName || 'Unknown Therapy',
            center: booking.centerName,
            location: booking.centerLocation,
            duration: booking.therapyDuration,
            cost: booking.therapyCost,
            date: bookingDate.toISOString(),
            status: booking.status || 'scheduled',
            specialRequirements: booking.specialRequirements,
            practitionerId: PRACTITIONER_ID,
            type: 'patient_booking'
          };
        } catch (error) {
          console.error('Error converting booking:', booking, error);
          // Return a fallback appointment to avoid breaking the array
          return {
            id: booking.id || Date.now(),
            patientName: booking.patientName || 'Unknown Patient',
            patientId: booking.patientId || 'unknown',
            therapy: booking.therapyName || 'Unknown Therapy',
            date: new Date().toISOString(),
            status: 'scheduled',
            practitionerId: PRACTITIONER_ID,
            type: 'patient_booking_error'
          };
        }
      });
      
      console.log('Converted bookings:', convertedBookings); // Debug log
      
      // Combine mock appointments with patient bookings
      const allAppointments = [...mockAppointments, ...convertedBookings];
      
      return allAppointments;
    } catch (error) {
      console.error('Error loading appointments:', error);
      return [];
    }
  };

  // Helper function to convert time string to ISO format
  const convertTimeToISO = (timeString) => {
    // Convert "9:00 AM" to "09:00:00"
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const allAppointments = loadAppointments();
        
        const mockNotes = [
          { id: 1, appointmentId: 101, vitals: 'BP:119/77', observations: 'Rested', recommendations: 'Walk 15 mins', createdAt: '2024-09-23T13:49:04Z', practitionerId: PRACTITIONER_ID },
          { id: 2, appointmentId: 102, vitals: 'BP:120/80', observations: 'Relaxed', recommendations: 'Avoid caffeine', createdAt: '2024-09-23T13:49:04Z', practitionerId: PRACTITIONER_ID }
        ];
        
        if (!mounted) return;
        setAppointments(allAppointments);
        setTherapyNotes(mockNotes);
        if (allAppointments.length > 0) {
          const today = new Date();
          const todays = allAppointments.filter((a) => isSameDay(new Date(a.date), today));
          const first = (todays.length > 0 ? todays[0] : allAppointments[0]) || null;
          setSelectedPatientId(first?.patientId ?? null);
          setSelectedAppointmentId(first?.id ?? null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    
    // Set up polling to check for new bookings every 2 seconds
    const pollInterval = setInterval(() => {
      if (mounted) {
        const newAppointments = loadAppointments();
        setAppointments(newAppointments);
      }
    }, 2000);
    
    // Also listen for custom events when bookings are made
    const handleBookingUpdate = () => {
      if (mounted) {
        const newAppointments = loadAppointments();
        setAppointments(newAppointments);
      }
    };
    
    window.addEventListener('patientBookingAdded', handleBookingUpdate);
    
    return () => {
      mounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('patientBookingAdded', handleBookingUpdate);
    };
  }, []);

  const patients = useMemo(() => {
    const unique = new Map();
    for (const a of appointments) {
      const pid = a?.patientId;
      if (pid == null) continue;
      if (!unique.has(String(pid))) {
        const u = userIndex.get(String(pid));
        unique.set(String(pid), {
          id: pid,
          name: a?.patientName ?? u?.name ?? u?.fullName ?? `Patient ${pid}`,
        });
      }
    }
    return Array.from(unique.values());
  }, [appointments, userIndex]);

  const filteredAppointments = useMemo(() => {
    const list = appointments.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!selectedPatientId) return list;
    return list.filter((a) => String(a.patientId) === String(selectedPatientId));
  }, [appointments, selectedPatientId]);

  // Today's appointments only
  const todaysAppointments = useMemo(() => {
    const today = new Date();
    
    // Filter appointments for practitioner and today only
    let list = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      const isPractitioner = String(a.practitionerId) === String(PRACTITIONER_ID);
      const isToday = isSameDay(appointmentDate, today);
      
      return isPractitioner && isToday;
    });
    
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return list;
  }, [appointments]);

  const selectedAppointment = useMemo(() => {
    return appointments.find((a) => String(a.id) === String(selectedAppointmentId));
  }, [appointments, selectedAppointmentId]);

  // Derived dashboard KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    const todaysAppointmentsCount = appointments.filter((a) => isSameDay(new Date(a.date), today)).length;
    const nextAppointment = appointments
      .filter((a) => new Date(a.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const notesForMe = therapyNotes.filter((n) => String(n.practitionerId ?? "") === String(PRACTITIONER_ID));
    return {
      patients: patients.length,
      todaysAppointments: todaysAppointmentsCount,
      completedNotes: notesForMe.length,
      nextAppointment: nextAppointment ? new Date(nextAppointment.date) : null,
    };
  }, [appointments, therapyNotes, patients]);

  const handleNoteCreated = (note) => {
    setTherapyNotes((prev) => [note, ...prev]);
  };

  const fmtDateTime = (d) => (d ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Practitioner Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Welcome back, Dr. {user?.name || 'practitioner'}! Here's your schedule for today.</p>
          </div>
          <button
            onClick={() => {
              const newAppointments = loadAppointments();
              setAppointments(newAppointments);
            }}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpis.todaysAppointments}</div>
                <div className="text-sm text-slate-600">Today's Appointments</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-blue-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <span className="text-xl font-bold text-green-600">28</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">This Week</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpis.patients}</div>
                <div className="text-sm text-slate-600">Total Patients</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-purple-50 opacity-50"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <span className="text-xl font-bold text-orange-600">4.8</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Rating</div>
                <div className="text-sm text-slate-600">Patient Feedback</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-orange-50 opacity-50"></div>
          </div>
        </div>

        {/* Debug Section - Show all appointments */}
        {false && (
          <div className="mb-6 rounded-2xl bg-gray-100 p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">Debug: All Appointments ({appointments.length})</h3>
            <div className="max-h-40 overflow-y-auto">
              {appointments.map((apt, idx) => (
                <div key={apt.id} className="mb-2 rounded bg-white p-2 text-xs">
                  <div><strong>#{apt.id}</strong> - {apt.patientName} - {apt.therapy}</div>
                  <div className="text-gray-600">Date: {new Date(apt.date).toLocaleString()}</div>
                  <div className="text-gray-600">Status: {apt.status} | Type: {apt.type || 'mock'}</div>
                  {apt.patientPhone && <div className="text-gray-600">Phone: {apt.patientPhone}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-6 text-lg font-semibold text-slate-800">Today's Appointments</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 animate-shimmer rounded-lg bg-slate-100"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysAppointments.map((appointment, idx) => {
                    const patient = userIndex.get(String(appointment.patientId));
                    const time = new Date(appointment.date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    });
                    
                    const statusColors = {
                      confirmed: 'bg-green-100 text-green-800',
                      pending: 'bg-yellow-100 text-yellow-800',
                      completed: 'bg-blue-100 text-blue-800'
                    };
                    
                    const status = appointment.status;
                    
                    return (
                      <div
                        key={appointment.id}
                        className={`flex items-center justify-between rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
                          String(selectedAppointmentId) === String(appointment.id)
                            ? 'border-amber-300 bg-amber-50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          setSelectedAppointmentId(appointment.id);
                          setSelectedPatientId(appointment.patientId);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-slate-600">{time}</div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {patient?.name || appointment.patientName}
                            </div>
                            <div className="text-sm text-slate-500">{appointment.therapy}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
                            {status}
                          </span>
                          <button 
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientId(appointment.patientId);
                              setHistoryOpen(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {todaysAppointments.length === 0 && (
                    <div className="py-12 text-center">
                      <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                      <h3 className="mt-2 text-sm font-medium text-slate-900">No appointments today</h3>
                      <p className="mt-1 text-sm text-slate-500">Enjoy your day off!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Notes */}
          <div className="space-y-6">
            {/* Seasonal Intelligence */}
            <SeasonalIntelligence practitionerId={PRACTITIONER_ID} />
            
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h2>
              
              <div className="space-y-3">
                <button 
                  className="w-full rounded-lg bg-amber-600 p-3 text-left text-white hover:bg-amber-700 transition-colors"
                  onClick={() => {
                    if (selectedAppointment) {
                      // Scroll to therapy form if appointment selected
                      document.querySelector('#therapy-form')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      alert('Please select an appointment first to add notes.');
                    }
                  }}
                >
                  <div className="font-medium">Add Patient Notes</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-blue-600 p-3 text-left text-white hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // For now, show a simple alert. Later can integrate with calendar
                    alert('Schedule Appointment feature coming soon!');
                  }}
                >
                  <div className="font-medium">Schedule Appointment</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-green-600 p-3 text-left text-white hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (selectedPatientId) {
                      setHistoryOpen(true);
                    } else {
                      alert('Please select a patient first to view their history.');
                    }
                  }}
                >
                  <div className="font-medium">View Patient History</div>
                </button>
                
                <button 
                  className="w-full rounded-lg bg-purple-600 p-3 text-left text-white hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    if (selectedPatientId) {
                      alert('Generate Prescription feature coming soon!');
                    } else {
                      alert('Please select a patient first to generate prescription.');
                    }
                  }}
                >
                  <div className="font-medium">Generate Prescription</div>
                </button>
              </div>
            </div>

            {/* Recent Notes */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Recent Notes</h2>
                <select
                  className="rounded-md border border-slate-200 px-3 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  value={recentFilter}
                  onChange={(e) => setRecentFilter(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="all">All</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {(() => {
                  const msDay = 24 * 60 * 60 * 1000;
                  const now = new Date();
                  const filtered = therapyNotes
                    .filter((n) => {
                      const dt = new Date(n.createdAt || now);
                      if (recentFilter === "today") {
                        return isSameDay(dt, now);
                      }
                      if (recentFilter === "7") {
                        return now - dt <= 7 * msDay;
                      }
                      if (recentFilter === "30") {
                        return now - dt <= 30 * msDay;
                      }
                      return true;
                    })
                    .sort((a, b) => new Date(b.createdAt || now) - new Date(a.createdAt || now))
                    .slice(0, 4);

                  return filtered.length === 0 ? (
                    <div className="py-8 text-center">
                      <ClipboardDocumentCheckIcon className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-500">No notes in this period.</p>
                    </div>
                  ) : (
                    filtered.map((note) => {
                      const patient = appointments.find(a => String(a.id) === String(note.appointmentId));
                      const patientName = patient ? userIndex.get(String(patient.patientId))?.name || patient.patientName : 'Unknown';
                      
                      return (
                        <div key={note.id} className="rounded-lg border border-slate-200 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="font-medium text-slate-900">{patientName}</div>
                            <div className="text-xs text-slate-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            {note.observations ? note.observations.substring(0, 60) + '...' : 'Responded well to Panchakarma treatment. Continue with current regimen.'}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {Math.floor(Math.random() * 10) + 1} days ago
                          </div>
                        </div>
                      );
                    })
                  );
                })()}
              </div>
            </div>

            {/* This Month Stats */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">This Month</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Consultations</div>
                  <div className="font-medium text-slate-900">45</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Panchakarmas</div>
                  <div className="font-medium text-slate-900">12</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Messages</div>
                  <div className="font-medium text-slate-900">28</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Follow-ups</div>
                  <div className="font-medium text-slate-900">18</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Therapy Form Section */}
        {selectedAppointment && (
          <div id="therapy-form" className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Therapy Note for {userIndex.get(String(selectedAppointment.patientId))?.name || selectedAppointment.patientName}</h2>
            <TherapyForm
              appointment={selectedAppointment}
              practitionerId={PRACTITIONER_ID}
              onNoteCreated={handleNoteCreated}
            />
          </div>
        )}
      </div>

      {/* Patient History Drawer */}
      <PatientHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        patient={selectedPatientId ? userIndex.get(String(selectedPatientId)) : null}
        appointments={appointments.filter((a) => String(a.patientId) === String(selectedPatientId))}
        therapyNotes={therapyNotes.filter((n) =>
          appointments.some((a) => String(a.patientId) === String(selectedPatientId) && String(a.id) === String(n.appointmentId))
        )}
        feedback={[]}
      />
    </div>
  );
};

export default PractitionerDashboard;