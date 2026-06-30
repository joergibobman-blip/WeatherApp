import { useState, useCallback } from 'react'
import './App.css'

// WMO Weather interpretation codes
const WMO_CODES = {
  0:  { label: 'Clear Sky',                    icon: '☀️'  },
  1:  { label: 'Mainly Clear',                 icon: '🌤️'  },
  2:  { label: 'Partly Cloudy',                icon: '⛅'  },
  3:  { label: 'Overcast',                     icon: '☁️'  },
  45: { label: 'Foggy',                        icon: '🌫️'  },
  48: { label: 'Depositing Rime Fog',          icon: '🌫️'  },
  51: { label: 'Light Drizzle',               icon: '🌦️'  },
  53: { label: 'Drizzle',                      icon: '🌦️'  },
  55: { label: 'Heavy Drizzle',               icon: '🌦️'  },
  61: { label: 'Light Rain',                   icon: '🌧️'  },
  63: { label: 'Rain',                         icon: '🌧️'  },
  65: { label: 'Heavy Rain',                   icon: '🌧️'  },
  71: { label: 'Light Snowfall',              icon: '❄️'  },
  73: { label: 'Snowfall',                     icon: '❄️'  },
  75: { label: 'Heavy Snowfall',              icon: '❄️'  },
  77: { label: 'Snow Grains',                  icon: '🌨️'  },
  80: { label: 'Light Rain Showers',          icon: '🌦️'  },
  81: { label: 'Rain Showers',               icon: '🌦️'  },
  82: { label: 'Violent Rain Showers',        icon: '⛈️'  },
  85: { label: 'Snow Showers',               icon: '🌨️'  },
  86: { label: 'Heavy Snow Showers',         icon: '🌨️'  },
  95: { label: 'Thunderstorm',               icon: '⛈️'  },
  96: { label: 'Thunderstorm w/ Hail',       icon: '⛈️'  },
  99: { label: 'Thunderstorm w/ Heavy Hail', icon: '⛈️'  },
}

function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡️' }
}

function windDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

function formatDay(dateStr, index) {
  if (index === 0) return 'Today'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="centered">
      <div className="spinner" aria-label="Loading weather data" />
      <p className="loading-text">Fetching weather data…</p>
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="centered">
      <div className="error-card">
        <span className="error-icon">⚠️</span>
        <p>{message}</p>
      </div>
    </div>
  )
}

function Welcome() {
  return (
    <div className="centered">
      <div className="welcome-card">
        <div className="welcome-icon">🌍</div>
        <h2>Welcome to WeatherApp</h2>
        <p>Search for any city to see the current weather conditions and the 7-day forecast.</p>
      </div>
    </div>
  )
}

function StatBadge({ icon, label, value }) {
  return (
    <div className="stat-badge">
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}

function CurrentWeather({ weather }) {
  const { city, country, country_code, current } = weather
  const info = getWeatherInfo(current.weather_code)

  return (
    <div className="current-card glass">
      <div className="current-location">
        <span className="flag" aria-hidden="true">
          {country_code
            ? String.fromCodePoint(
                ...country_code
                  .toUpperCase()
                  .split('')
                  .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
              )
            : '🌐'}
        </span>
        <div>
          <h2 className="city-name">{city}</h2>
          <p className="country-name">{country}</p>
        </div>
      </div>

      <div className="current-main">
        <div className="current-icon">{info.icon}</div>
        <div className="current-temp-block">
          <span className="current-temp">{Math.round(current.temperature_2m)}°</span>
          <span className="current-unit">C</span>
        </div>
      </div>

      <p className="current-condition">{info.label}</p>
      <p className="current-feels">Feels like {Math.round(current.apparent_temperature)}°C</p>

      <div className="stats-grid">
        <StatBadge icon="💧" label="Humidity"    value={`${current.relative_humidity_2m}%`} />
        <StatBadge icon="💨" label="Wind"        value={`${Math.round(current.wind_speed_10m)} km/h ${windDirection(current.wind_direction_10m)}`} />
        <StatBadge icon="🌡️" label="Pressure"   value={`${Math.round(current.surface_pressure)} hPa`} />
        <StatBadge icon="🌂" label="Precip."     value={`${current.precipitation} mm`} />
      </div>
    </div>
  )
}

function ForecastCard({ dateStr, index, maxTemp, minTemp, weatherCode, precipitation, windMax }) {
  const info = getWeatherInfo(weatherCode)
  return (
    <div className="forecast-card glass">
      <p className="forecast-day">{formatDay(dateStr, index)}</p>
      <div className="forecast-icon">{info.icon}</div>
      <p className="forecast-condition">{info.label}</p>
      <div className="forecast-temps">
        <span className="forecast-max">{Math.round(maxTemp)}°</span>
        <span className="forecast-min">{Math.round(minTemp)}°</span>
      </div>
      <div className="forecast-footer">
        <span title="Precipitation">🌂 {precipitation} mm</span>
        <span title="Max wind">💨 {Math.round(windMax)} km/h</span>
      </div>
    </div>
  )
}

function Forecast({ daily }) {
  return (
    <section className="forecast-section">
      <h3 className="section-title">7-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.time.map((dateStr, i) => (
          <ForecastCard
            key={dateStr}
            dateStr={dateStr}
            index={i}
            maxTemp={daily.temperature_2m_max[i]}
            minTemp={daily.temperature_2m_min[i]}
            weatherCode={daily.weather_code[i]}
            precipitation={daily.precipitation_sum[i]}
            windMax={daily.wind_speed_10m_max[i]}
          />
        ))}
      </div>
    </section>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [city, setCity]     = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const fetchWeather = useCallback(async (cityName) => {
    const trimmed = cityName.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`
      )
      if (!geoRes.ok) throw new Error('Geocoding request failed')
      const geoData = await geoRes.json()

      if (!geoData.results?.length) {
        setError(`City "${trimmed}" not found. Please try another city.`)
        return
      }

      const { latitude, longitude, name, country, country_code } = geoData.results[0]

      const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'precipitation',
          'surface_pressure',
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'precipitation_sum',
          'wind_speed_10m_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      })

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!weatherRes.ok) throw new Error('Weather request failed')
      const weatherData = await weatherRes.json()

      setWeather({ city: name, country, country_code, current: weatherData.current, daily: weatherData.daily })
    } catch {
      setError('Failed to fetch weather data. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather(city)
  }

  return (
    <div className="app">
      <div className="app-container">
        <header className="header">
          <h1 className="logo">🌤 WeatherApp</h1>
          <form className="search-form" onSubmit={handleSubmit} role="search">
            <input
              className="search-input"
              type="search"
              placeholder="Search for a city…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City name"
              autoComplete="off"
            />
            <button className="search-btn" type="submit" disabled={loading}>
              {loading ? '…' : 'Search'}
            </button>
          </form>
        </header>

        <main className="main">
          {loading && <LoadingSpinner />}
          {!loading && error   && <ErrorMessage message={error} />}
          {!loading && !error && !weather && <Welcome />}
          {!loading && !error &&  weather && (
            <>
              <CurrentWeather weather={weather} />
              <Forecast daily={weather.daily} />
            </>
          )}
        </main>

        <footer className="footer">
          <p>Weather data provided by <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a></p>
        </footer>
      </div>
    </div>
  )
}
