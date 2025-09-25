import React, { useState, useEffect } from 'react';

export default function SeasonalIntelligence({ practitionerId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'

  useEffect(() => {
    // Try to get user's location first
    getCurrentLocation();
  }, [practitionerId]);

  useEffect(() => {
    // Fetch data when location changes or initially
    fetchSeasonalData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchSeasonalData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, practitionerId]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      setLocation({ lat: 19.0760, lng: 72.8777, city: 'Mumbai (Default)' }); // Default fallback
      return;
    }
    
    setLocationPermission('requesting');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Location detected:', lat, lng);
        setLocation({
          lat: lat,
          lng: lng,
          accuracy: position.coords.accuracy,
          city: 'Detecting...'
        });
        setLocationPermission('granted');
      },
      (error) => {
        console.log('Geolocation error:', error.message, error.code);
        setLocationPermission('denied');
        
        // More specific error messages
        let errorCity = 'Location unavailable';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorCity = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorCity = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorCity = 'Location timeout';
            break;
        }
        
        // Fallback to Mumbai coordinates but show it's a fallback
        setLocation({ lat: 19.0760, lng: 72.8777, city: `${errorCity} - Using Mumbai` });
      },
      options
    );
  };

  const fetchSeasonalData = async () => {
    try {
      setError(null);
      
      // Use detected location or fallback to Mumbai
      const coords = location || { lat: 19.0760, lng: 72.8777 };
      const url = `http://localhost:5002/api/seasonal/intelligence/${practitionerId || 4}?lat=${coords.lat}&lng=${coords.lng}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch seasonal data:', error);
      setError(error.message);
      // Show mock data on error for demo purposes
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    location: { city: 'Mumbai', country: 'India' },
    weather: { temperature: 28, humidity: 82, condition: 'Clouds', description: 'overcast clouds' },
    season: 'monsoon',
    moonPhase: 'Waxing Crescent',
    doshaEffects: { vata: 'increase', pitta: 'decrease', kapha: 'increase' },
    recommendations: {
      recommended: ['Use warming sesame oil for Abhyanga', 'Focus on digestive fire enhancement'],
      avoid: ['Cooling coconut oil applications', 'Heavy detoxification programs']
    },
    alerts: [{
      type: 'weather',
      severity: 'warning',
      message: 'High humidity may aggravate Vata and Kapha doshas',
      affectedPatients: 8
    }],
    patientImpact: { totalPatients: 24, requireModifications: 12, urgentCases: 2 },
    dataSource: 'mock'
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getWeatherIcon = (condition) => {
    if (condition?.includes('Cloud')) return <span className="text-blue-500">☁️</span>;
    if (condition?.includes('Sun') || condition?.includes('Clear')) return <span className="text-yellow-500">☀️</span>;
    return <span className="text-slate-500">☁️</span>;
  };

  const getSeasonEmoji = (season) => {
    switch (season) {
      case 'monsoon': return '🌧️';
      case 'summer': return '☀️';
      case 'winter': return '❄️';
      case 'spring': return '🌸';
      case 'post_monsoon': return '🍂';
      default: return '🌿';
    }
  };

  const getDoshaColor = (effect) => {
    switch (effect) {
      case 'increase': return 'text-red-600 bg-red-100';
      case 'decrease': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-200 rounded"></div>
            <div className="h-4 bg-blue-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-lg p-3 space-y-2">
              <div className="h-3 bg-blue-200 rounded w-16"></div>
              <div className="h-4 bg-blue-200 rounded w-12"></div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 space-y-2">
              <div className="h-3 bg-blue-200 rounded w-16"></div>
              <div className="h-4 bg-blue-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm font-medium text-red-800">Connection Error</span>
        </div>
        <p className="text-xs text-red-600 mb-3">Unable to fetch live weather data</p>
        <button 
          onClick={fetchSeasonalData}
          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <h3 className="text-lg font-semibold text-slate-800">Seasonal Intelligence</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xs px-2 py-1 rounded-full ${data?.dataSource === 'live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {data?.dataSource === 'live' ? '🟢 Live' : '⚡ Demo'}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-slate-600">
          📍 {data?.location.city}, {data?.location.country}
        </div>
        {locationPermission !== 'granted' && (
          <button
            onClick={getCurrentLocation}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
            title="Detect your location for accurate weather"
          >
            📍 Use My Location
          </button>
        )}
        {locationPermission === 'granted' && (
          <span className="text-xs text-green-600">✓ Location detected</span>
        )}
      </div>

      {/* Quick Location Selector */}
      <div className="mb-3">
        <select 
          className="text-xs border border-slate-200 rounded px-2 py-1 w-full"
          onChange={(e) => {
            if (e.target.value) {
              const [lat, lng, city] = e.target.value.split(',');
              setLocation({ lat: parseFloat(lat), lng: parseFloat(lng), city: city.trim() });
              setLocationPermission('manual');
            }
          }}
          defaultValue=""
        >
          <option value="">📍 Or select a city...</option>
          <option value="28.6139,77.2090,New Delhi">New Delhi</option>
          <option value="19.0760,72.8777,Mumbai">Mumbai</option>
          <option value="12.9716,77.5946,Bangalore">Bangalore</option>
          <option value="13.0827,80.2707,Chennai">Chennai</option>
          <option value="22.5726,88.3639,Kolkata">Kolkata</option>
          <option value="26.9124,75.7873,Jaipur">Jaipur</option>
          <option value="21.1458,79.0882,Nagpur">Nagpur</option>
          <option value="23.0225,72.5714,Ahmedabad">Ahmedabad</option>
          <option value="17.3850,78.4867,Hyderabad">Hyderabad</option>
          <option value="11.0168,76.9558,Coimbatore">Coimbatore</option>
        </select>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/70 backdrop-blur rounded-lg p-3 border border-white/40">
          <div className="flex items-center gap-2 mb-1">
            {getWeatherIcon(data?.weather.condition)}
            <span className="text-xs text-slate-600">Weather</span>
          </div>
          <div className="font-semibold text-slate-900">{data?.weather.temperature}°C</div>
          <div className="text-xs text-slate-600 capitalize">{data?.weather.description}</div>
          <div className="text-xs text-slate-500">💧 {data?.weather.humidity}%</div>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-lg p-3 border border-white/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🌙</span>
            <span className="text-xs text-slate-600">Lunar</span>
          </div>
          <div className="font-semibold text-slate-900 text-sm">{data?.moonPhase}</div>
          <div className="text-xs text-slate-600 flex items-center gap-1">
            {getSeasonEmoji(data?.season)}
            <span className="capitalize">{data?.season}</span>
          </div>
        </div>
      </div>

      {/* Dosha Effects */}
      <div className="mb-4">
        <div className="text-xs font-medium text-slate-700 mb-2">Dosha Tendencies:</div>
        <div className="flex gap-2">
          {data?.doshaEffects && Object.entries(data.doshaEffects).map(([dosha, effect]) => (
            <div key={dosha} className={`text-xs px-2 py-1 rounded-full ${getDoshaColor(effect)}`}>
              {dosha.charAt(0).toUpperCase() + dosha.slice(1)}: {effect}
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {data?.alerts && data.alerts.length > 0 && (
        <div className="mb-4">
          {data.alerts.slice(0, 1).map((alert, index) => (
            <div key={index} className={`border rounded-lg p-3 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-amber-500">⚠️</span>
                <span className="text-xs font-medium capitalize">{alert.severity} Alert</span>
              </div>
              <div className="text-xs">{alert.message}</div>
              <div className="text-xs mt-1 opacity-75">
                Affects ~{alert.affectedPatients} patients
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center bg-white/50 rounded-lg py-2">
          <div className="text-lg font-bold text-slate-900">{data?.patientImpact.totalPatients}</div>
          <div className="text-xs text-slate-600">Patients</div>
        </div>
        <div className="text-center bg-amber-50/70 rounded-lg py-2">
          <div className="text-lg font-bold text-amber-600">{data?.patientImpact.requireModifications}</div>
          <div className="text-xs text-slate-600">Need Adjust</div>
        </div>
        <div className="text-center bg-red-50/70 rounded-lg py-2">
          <div className="text-lg font-bold text-red-600">{data?.patientImpact.urgentCases}</div>
          <div className="text-xs text-slate-600">Urgent</div>
        </div>
      </div>

      {/* Quick Recommendations Preview */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-medium text-slate-700">Today's Focus:</div>
        {data?.recommendations.recommended.slice(0, 1).map((rec, index) => (
          <div key={index} className="text-xs text-green-700 bg-green-50 px-2 py-1.5 rounded border border-green-200">
            ✓ {rec}
          </div>
        ))}
        {data?.recommendations.avoid.slice(0, 1).map((avoid, index) => (
          <div key={index} className="text-xs text-red-700 bg-red-50 px-2 py-1.5 rounded border border-red-200">
            ⚠ {avoid}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button 
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm py-2 px-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'View'} Detailed Recommendations
          <span className={`transition-transform ${showDetails ? 'rotate-90' : ''}`}>▶</span>
        </button>
        
        {showDetails && (
          <div className="mt-3 bg-white/80 rounded-lg p-4 border border-white/60 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">✓ Recommended Actions</h4>
              <div className="space-y-1">
                {data?.recommendations.recommended.map((item, index) => (
                  <div key={index} className="text-xs text-slate-700 bg-green-50 px-2 py-1 rounded">
                    • {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">⚠ Avoid Today</h4>
              <div className="space-y-1">
                {data?.recommendations.avoid.map((item, index) => (
                  <div key={index} className="text-xs text-slate-700 bg-red-50 px-2 py-1 rounded">
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            {data?.recommendations.oils && data.recommendations.oils.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2">🛢️ Recommended Oils</h4>
                <div className="flex flex-wrap gap-1">
                  {data.recommendations.oils.map((oil, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {oil}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data?.recommendations.therapies && data.recommendations.therapies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-purple-700 mb-2">🌿 Optimal Therapies</h4>
                <div className="flex flex-wrap gap-1">
                  {data.recommendations.therapies.map((therapy, index) => (
                    <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {therapy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <button 
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 rounded-lg transition-colors"
          onClick={fetchSeasonalData}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}