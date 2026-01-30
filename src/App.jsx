import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather(null);
      setError("City not found. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();
        setWeather(data);
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? (
            <>
              <i className="bi bi-moon-stars-fill"></i> Dark Mode
            </>
          ) : (
            <>
              <i className="bi bi-brightness-high-fill"></i> Light Mode
            </>
          )}
        </button>

        <h1>Weather Dashboard</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        <button className="location-btn" onClick={getCurrentLocationWeather}>
          <i className="bi bi-geo"></i> Use Current Location
        </button>

        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-content">
            <div className="weather-card">
              <h2>{weather.name}</h2>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />

              <p className="temp">
                {Math.round(weather.main.temp)}°C
              </p>

              <p>{weather.weather[0].description}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
