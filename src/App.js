import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  function handleSearch(event) {
    setCity(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault(); // Prevents page reload

    const API_KEY = process.env.REACT_APP_MY_API_KEY;
    console.log(API_KEY);
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      )
      .then((response) => {
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;

        return axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${API_KEY}`
        );
      })
      .then((response2) => {
        setWeather(response2.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={handleSubmit} action="/search-results" method="get">
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

        {weather &&
          weather.daily.slice(0, 7).map(function (day, index) {
            return (
              <div className="card" key={index}>
                <h2>Day {index + 1} Forecast</h2>
                <p>Temperature: {day.temp.day}°F</p>
                <p>Condition: {day.weather[0].description}</p>
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
