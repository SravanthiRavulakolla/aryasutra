// frontend/src/components/patient/UpcomingAppointments.js
import React from 'react';

const UpcomingAppointments = () => {
  // Mock upcoming appointments data
  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-01-25',
      time: '10:00 AM',
      therapy: 'Abhyanga',
      practitioner: 'Dr. Priya Sharma',
      duration: '60 min',
      status: 'confirmed',
      preparation: 'Light breakfast recommended',
      color: 'green'
    },
    {
      id: 2,
      date: '2024-01-27',
      time: '11:30 AM',
      therapy: 'Shirodhara',
      practitioner: 'Dr. Rajesh Kumar',
      duration: '45 min',
      status: 'confirmed',
      preparation: 'Empty stomach preferred',
      color: 'blue'
    },
    {
      id: 3,
      date: '2024-01-29',
      time: '2:00 PM',
      therapy: 'Kizhi',
      practitioner: 'Dr. Priya Sharma',
      duration: '50 min',
      status: 'pending',
      preparation: 'Wear comfortable clothing',
      color: 'purple'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border-amber-300';
      case 'pending':
        return 'bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border-orange-300';
      case 'rescheduled':
        return 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getTherapyIcon = (therapy) => {
    const icons = {
      'Abhyanga': '🫖',
      'Shirodhara': '💧',
      'Kizhi': '🌿',
      'Pizhichil': '🛁',
      'Udwarthanam': '✨'
    };
    return icons[therapy] || '🧘‍♀️';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const getDaysUntil = (dateString) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg border border-amber-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-900 flex items-center">
          <span className="text-xl mr-2">📅</span>
          Upcoming Sessions
        </h3>
        <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {upcomingAppointments.map((appointment, index) => {
          const daysUntil = getDaysUntil(appointment.date);
          const isNext = index === 0;

          return (
            <div
              key={appointment.id}
              className={`relative border rounded-lg p-4 transition-all hover:shadow-md ${
                isNext 
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50' 
                  : 'border-amber-200 bg-gradient-to-br from-white to-amber-50'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-3 top-6">
                <div
                  className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    isNext 
                      ? 'bg-amber-500' 
                      : appointment.status === 'confirmed' 
                      ? 'bg-orange-500' 
                      : 'bg-yellow-500'
                  }`}
                ></div>
              </div>

              {/* Timeline line (except for last item) */}
              {index < upcomingAppointments.length - 1 && (
                <div className="absolute -left-2.5 top-9 w-0.5 h-16 bg-amber-300"></div>
              )}

              <div className="ml-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTherapyIcon(appointment.therapy)}</span>
                    <h4 className="font-semibold text-amber-900">
                      {appointment.therapy}
                    </h4>
                    {isNext && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                        Next
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4 text-sm text-amber-700">
                    <span className="font-medium">
                      {formatDate(appointment.date)}
                    </span>
                    <span>{appointment.time}</span>
                    <span>({appointment.duration})</span>
                  </div>
                  {daysUntil <= 7 && (
                    <span className="text-xs text-amber-800 font-medium">
                      {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </span>
                  )}
                </div>

                {/* Practitioner */}
                <div className="text-sm text-amber-700 mb-2">
                  <span className="font-medium">Dr:</span> {appointment.practitioner}
                </div>

                {/* Preparation note */}
                <div className="text-xs text-amber-600 bg-white rounded p-2 border border-amber-200">
                  <span className="font-medium">💡 Preparation:</span> {appointment.preparation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="flex items-center justify-between">
          <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">
            📞 Call Center
          </button>
          <button className="text-sm text-orange-700 hover:text-orange-800 font-medium">
            🔄 Reschedule
          </button>
          <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            📝 Add Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;