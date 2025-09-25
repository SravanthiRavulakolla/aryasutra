// frontend/src/components/patient/ProgressGraph.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressGraph = ({ progressData }) => {
  const { symptomSeverity, progressPercentage, currentTherapy } = progressData;

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-orange-300 rounded-lg shadow-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-orange-700 mb-1">Session {label}</p>
            <p className="text-2xl font-bold text-red-600">
              {payload[0].value}/10
            </p>
            <p className="text-sm text-orange-600 mt-1">
              Symptom Severity
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">
              📅 {data.date}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2">Recovery Progress 📈</h3>
        <p className="text-amber-700 text-sm">{currentTherapy}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-amber-800">Overall Progress</span>
          <span className="text-sm font-bold text-amber-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-amber-600 mt-1">
          <span>Started</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Symptom Severity Chart - Line Chart */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-amber-800 mb-3">Symptom Severity Trend</h4>
        <div className="h-80 w-full bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-300 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={symptomSeverity}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f59e0b" strokeOpacity={0.3} />
              <XAxis 
                dataKey="session" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#92400e', fontSize: 12, fontWeight: 'bold' }}
                tickFormatter={(value) => `S${value}`}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#92400e', fontSize: 12, fontWeight: 'bold' }}
                label={{ value: '', angle: 0, position: 'outside' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#ea580c"
                strokeWidth={4}
                dot={{ 
                  fill: '#ea580c', 
                  strokeWidth: 3, 
                  stroke: '#fff',
                  r: 6
                }}
                activeDot={{ 
                  r: 8, 
                  fill: '#dc2626',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs text-amber-600 mt-2">
          <span>Higher values indicate more severe symptoms</span>
          <span>Target: Consistent decline</span>
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg p-4 border border-amber-300">
        <h5 className="font-semibold text-amber-900 mb-2">🌿 Progress Insights</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-amber-800">Current Status:</span>
            <span className="ml-2 text-amber-700">
              {symptomSeverity.length > 0 
                ? symptomSeverity[symptomSeverity.length - 1].severity <= 3 
                  ? 'Excellent improvement' 
                  : symptomSeverity[symptomSeverity.length - 1].severity <= 5 
                  ? 'Good progress' 
                  : 'Steady improvement'
                : 'Just started'}
            </span>
          </div>
          <div>
            <span className="font-medium text-amber-800">Trend:</span>
            <span className="ml-2 text-amber-700">
              {symptomSeverity.length > 1 
                ? symptomSeverity[symptomSeverity.length - 1].severity < symptomSeverity[0].severity
                  ? '↓ Improving' 
                  : '→ Stable'
                : 'Baseline established'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressGraph;