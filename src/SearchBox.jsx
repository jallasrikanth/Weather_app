import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import "./SearchBox.css";

export default function SearchBox({ updateInfo }) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "15cdcae203e1eb468aed2d4873e85890";

    const getWeatherInfo = async () => {
        try {
            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            const jsonResponse = await response.json();

            if (jsonResponse.cod !== 200) {
                throw new Error(jsonResponse.message);
            }

            const result = {
                temp: jsonResponse.main.temp,
                tempMin: jsonResponse.main.temp_min,
                tempMax: jsonResponse.main.temp_max,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description,
                city: jsonResponse.name
            };

            return result;
        } catch (error) {
            console.error(error);
            setError("No such place exists. Please try again.");
            return null;
        }
    };

    const handleChange = (evt) => {
        setCity(evt.target.value);
        setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const newInfo = await getWeatherInfo();
        if (newInfo) {
            updateInfo(newInfo);
            setCity("");
        }
    };

    return (
        <div className='SearchBox'>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant='outlined'
                    required
                    value={city}
                    onChange={handleChange}
                />
                <br /><br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button variant='contained' type="submit">Search</Button>
            </form>
        </div>
    );
}
