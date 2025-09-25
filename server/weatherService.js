const axios = require('axios');
const SunCalc = require('suncalc');

class WeatherService {
  constructor() {
    // Use environment variable or fallback to demo key
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lng) {
    try {
      // If no API key, return realistic mock data
      if (this.apiKey === 'demo_key') {
        return this.getMockWeatherData(lat, lng);
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric'
        },
        timeout: 5000 // 5 second timeout
      });
      
      return {
        temperature: Math.round(response.data.main.temp),
        humidity: response.data.main.humidity,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        city: this.getFriendlyCityName(lat, lng, response.data.name),
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind?.speed || 0,
        visibility: response.data.visibility ? response.data.visibility / 1000 : null // Convert to km
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      // Fallback to mock data if API fails
      return this.getMockWeatherData(lat, lng);
    }
  }

  getMockWeatherData(lat, lng) {
    // Realistic mock data
    const city = this.getFriendlyCityName(lat, lng, 'Unknown City');
    
    return {
      temperature: 28,
      humidity: 82,
      condition: 'Clouds',
      description: 'overcast clouds',
      city,
      pressure: 1013,
      windSpeed: 3.5,
      visibility: 8
    };
  }

  getCurrentMoonPhase() {
    const now = new Date();
    const moonIllumination = SunCalc.getMoonIllumination(now);
    const moonPhase = moonIllumination.phase;
    
    // Convert phase number to readable name
    if (moonPhase < 0.03 || moonPhase > 0.97) return 'New Moon';
    if (moonPhase < 0.22) return 'Waxing Crescent';
    if (moonPhase < 0.28) return 'First Quarter';
    if (moonPhase < 0.47) return 'Waxing Gibbous';
    if (moonPhase < 0.53) return 'Full Moon';
    if (moonPhase < 0.72) return 'Waning Gibbous';
    if (moonPhase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }

  determineSeason(lat, date = new Date()) {
    const month = date.getMonth() + 1; // 1-12
    const isNorthern = lat > 0;
    
    // For India/Mumbai specifically, adjust for monsoon season
    const isIndia = lat > 6 && lat < 38 && this.isInIndianLongitude(date);
    
    if (isIndia) {
      if (month >= 3 && month <= 5) return 'summer';      // Mar-May: Hot
      if (month >= 6 && month <= 9) return 'monsoon';     // Jun-Sep: Monsoon
      if (month >= 10 && month <= 11) return 'post_monsoon'; // Oct-Nov: Post-monsoon
      return 'winter';                                     // Dec-Feb: Winter
    }
    
    // Standard seasons for other regions
    if (isNorthern) {
      if (month >= 3 && month <= 5) return 'spring';
      if (month >= 6 && month <= 8) return 'summer';
      if (month >= 9 && month <= 11) return 'autumn';
      return 'winter';
    } else {
      // Southern hemisphere (opposite seasons)
      if (month >= 3 && month <= 5) return 'autumn';
      if (month >= 6 && month <= 8) return 'winter';
      if (month >= 9 && month <= 11) return 'spring';
      return 'summer';
    }
  }

  isInIndianLongitude(date) {
    // Simplified check - in production, you'd use more sophisticated location detection
    return true; // Assume Indian subcontinent for this demo
  }

  // Map coordinates to user-friendly city names
  getFriendlyCityName(lat, lng, apiCityName) {
    // Define city mappings based on coordinates with tolerance
    const cityMappings = [
      { lat: 28.6139, lng: 77.2090, name: 'New Delhi', tolerance: 0.5 },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai', tolerance: 0.5 },
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore', tolerance: 0.3 },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai', tolerance: 0.3 },
      { lat: 22.5726, lng: 88.3639, name: 'Kolkata', tolerance: 0.3 },
      { lat: 26.9124, lng: 75.7873, name: 'Jaipur', tolerance: 0.3 },
      { lat: 21.1458, lng: 79.0882, name: 'Nagpur', tolerance: 0.3 },
      { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad', tolerance: 0.3 },
      { lat: 17.3850, lng: 78.4867, name: 'Hyderabad', tolerance: 0.3 },
      { lat: 11.0168, lng: 76.9558, name: 'Coimbatore', tolerance: 0.3 },
    ];

    // Find the closest matching city
    for (const city of cityMappings) {
      const latDiff = Math.abs(lat - city.lat);
      const lngDiff = Math.abs(lng - city.lng);
      
      if (latDiff <= city.tolerance && lngDiff <= city.tolerance) {
        return city.name;
      }
    }

    // If no match found, clean up the API city name
    if (apiCityName) {
      // Remove unwanted terms from API response
      const cleanName = apiCityName
        .replace(/Division$/, '')
        .replace(/District$/, '')
        .replace(/Region$/, '')
        .replace(/Area$/, '')
        .trim();
      
      // Special case mappings for common API responses
      const specialMappings = {
        'Konkan': 'Mumbai',
        'NCT': 'New Delhi',
        'Deccan': 'Hyderabad',
        'Western Ghats': 'Bangalore'
      };
      
      return specialMappings[cleanName] || cleanName || 'Unknown Location';
    }

    return 'Unknown Location';
  }

  // Get seasonal dosha tendencies
  getSeasonalDoshaEffects(season, weather) {
    const effects = {
      vata: 'neutral',
      pitta: 'neutral',
      kapha: 'neutral'
    };

    switch (season) {
      case 'monsoon':
        effects.vata = 'increase';
        effects.kapha = 'increase';
        effects.pitta = 'decrease';
        break;
      case 'summer':
        effects.pitta = 'increase';
        effects.vata = 'increase';
        effects.kapha = 'decrease';
        break;
      case 'winter':
        effects.kapha = 'increase';
        effects.vata = 'increase';
        effects.pitta = 'decrease';
        break;
      case 'spring':
        effects.kapha = 'increase';
        effects.pitta = 'neutral';
        effects.vata = 'decrease';
        break;
      case 'post_monsoon':
        effects.pitta = 'increase';
        effects.vata = 'neutral';
        effects.kapha = 'decrease';
        break;
    }

    // Adjust based on current weather conditions
    if (weather.humidity > 70) {
      effects.kapha = 'increase';
      effects.vata = 'increase';
    }
    if (weather.temperature > 30) {
      effects.pitta = 'increase';
    }
    if (weather.temperature < 20) {
      effects.vata = 'increase';
      effects.kapha = 'increase';
    }

    return effects;
  }
}

module.exports = WeatherService;