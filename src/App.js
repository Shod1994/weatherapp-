import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [searchedCity, setSearchedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSearch(event) {
    setCity(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSearchedCity(city);
    setLoading(true);

    const API_KEY = process.env.REACT_APP_MY_API_KEY;
    setError("");
    setWeather(null);

    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city.trim(),
        )}&limit=1&appid=${API_KEY}`,
      )
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          throw new Error("City not found");
        }
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;

        return axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${API_KEY}`,
        );
      })
      .then((response2) => {
        setWeather(response2.data);
      })
      .catch((error) => {
        if (error.message === "City not found") {
          setError("City not found. Try Again");
        } else {
          setError("Something went wrong. Please try again");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={handleSubmit} method="get">
          <label htmlFor="query">Weather App</label>
          <input
            onChange={handleSearch}
            type="search"
            id="query"
            name="q"
            placeholder="Enter City"
            value={city}
          />
          <button type="submit">Submit</button>
        </form>

        {loading ? <p>Loading...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {searchedCity && <h1>{searchedCity}</h1>}
        {weather &&
          weather.daily.slice(0, 7).map(function (day, index) {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleString("en-US", { weekday: "short" });
            const displayName = index === 0 ? "Today" : dayName;
            return (
              <div className="card" key={day.dt}>
                <h2>{displayName}</h2>
                <p>{Math.round(day.temp.day)}°F</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
