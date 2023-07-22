import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState("London"); //Default location

  const API_KEY = process.env.REACT_APP_API_KEY;
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`;
  const url2 = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=4&aqi=no&alerts=no`;

  const handleOnChange = (e) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response1 = await axios.get(url);
      const response2 = await axios.get(url2);

      setCurrentWeather(response1.data);
      setForecast(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const getTemperatureColor = () => {
    if (currentWeather) {
      const temperature = currentWeather.current.temp_c;
      if (temperature > 25) {
        return {
          color: "crimson",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        };
      } else if (temperature < 0) {
        return { color: "blue", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" };
      }
    }
    return { color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" };
  };

  return (
    <div className="app">
      <div className="search">
        <input
          type="text"
          placeholder="Enter location"
          onKeyPress={searchLocation}
          value={location}
          onChange={handleOnChange}
        />
      </div>

      <div className="container">
        {currentWeather ? (
          <div className="top">
            <div className="left">
              <div style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
                {currentWeather.location.name}
              </div>
              <div>
                <h1 style={getTemperatureColor()}>
                  {currentWeather.current.temp_c}°C
                </h1>
              </div>
              <div>
                <p style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
                  {currentWeather.current.condition.text}
                </p>
                <img
                  alt="icon"
                  width={150}
                  height={150}
                  src={currentWeather.current.condition.icon}
                />
              </div>

              <div className="right">
                <div>
                  <p>{currentWeather.current.humidity}%</p>
                  <p>Humidity</p>
                </div>
                <div>
                  <p>{currentWeather.current.feelslike_c}°C</p>
                  <p>Feels like</p>
                </div>
                <div>
                  <p>{currentWeather.current.pressure_mb}Mb</p>
                  <p>Pressure</p>
                </div>
                <div>
                  <p>{currentWeather.current.wind_kph}km/h</p>
                  <p> Wind Speed </p>
                </div>
                <div>
                  <p>{currentWeather.current.uv}</p>
                  <p> UV Index</p>
                </div>
              </div>
            </div>
            <div className="bottom">
              {forecast &&
              forecast.forecast &&
              forecast.forecast.forecastday.length > 0 ? (
                forecast.forecast.forecastday.map((day) => {
                  const forecastDate = new Date(day.date);
                  const weekday = forecastDate.toLocaleDateString("en-US", {
                    weekday: "long",
                  });

                  return (
                    <div className="forecastbox" key={day.date}>
                      <h3
                        style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
                      >
                        {weekday}
                      </h3>
                      <img
                        alt="icon"
                        width={50}
                        height={50}
                        src={day.day.condition.icon}
                      />
                      <div>
                        <p>Temperature: {day.day.avgtemp_c}°C</p>
                        <p> Description: {day.day.condition.text}</p>
                        <p>Humidity: {day.day.avghumidity}%</p>
                        <p> Wind Speed: {day.day.maxwind_kph} kph</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Loading forecast data...</p>
              )}
            </div>
          </div>
        ) : (
          <p className="loading">Loading weather data... </p>
        )}
      </div>
    </div>
  );
};

export default App;
