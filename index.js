// const searchButton = document.getElementById("search_button")
const cityInput = document.getElementById("city_input");
const weatherCards = document.querySelector(".weather_cards");
const currentWeather = document.querySelector(".current_weather");
const locationButton = document.getElementById("location_button");
const searchButton = document.getElementById("search_button");

// const WEATHER_API = "http://api.openweathermap.org/data/2.5/forecast";
const ApiKey = "47796cacb38056cc3a9aa8371ce224cc";  //API Key for OpenWeatherMap API

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
    // const WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${ApiKey}`;
    

    // ----------------------------------- Fetching Weather API  --------------------------------------------
    fetch(WEATHER_API).then(res => res.jason()).then(data => {
        console.log(data);

        // Filter out the forecasts to get only one forecast per day
        const uniqueForecastingDays = [];

        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastingDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastingDays.includes(forecastingDate)) {
                return uniqueForecastingDays.push(forecastingDate);
            }
        });

        // clearing previous weather data
        cityName.value = "";
        currentWeather.innerHTML = "";
        weatherCards.innerHTML = "";

        console.log(fiveDaysForecast);

        fiveDaysForecast.forEach((weatherItems, index) => {
            if (index === 0) {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCards(cityName, weatherItems, index));
            } else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCards(cityName, weatherItems, index));
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecasting..!")
    })
}

// --------------------------------  Taking City coordinates from API  ---------------------------------------------
const getCityInput = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;   // return if city name is empty.

    // console.log(cityName);

    const GEOCODING_API_URI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`;

    fetch(GEOCODING_API_URI).then(res => res.json()).then(data => {
        console.log(data);
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the api..!")
    })
}

// *********************************  Creation of weather cards  ***************************************************
const createWeatherCards = (cityName, weatherItems, index) => {
    if (index === 0) {      // HTML For the main weather card
        return `<div class="details">
                <h2>${cityName} ${weatherItems.dt_txt.split(" ")[0]}</h2>
                <h4>Temperature: ${(weatherItems.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItems.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItems.main.humidity}%</h4>
            </div>
            <div class="icon">
              <img src="https://openweathermap.org/img/wn/${weatherItems.weather[0].icon}@2x.png" alt="weather_icon">
                <h4>${weatherItems.weather[0].description}</h4>
            </div>`;
    } else {
        return `<li class="card">
        <h3>(${weatherItems.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItems.weather[0].icon}@2x.png" alt="weather_icon">
        <h4>Temp: ${(weatherItems.main.temp - 273.15).toFixed(2)} °C</h4>
        <h4>Wind: ${weatherItems.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItems.main.humidity}%</h4>
    </li>`;
    }
}


// **************************************  Function making for User Coordiantes *****************************************
const getUserInput = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            // console.log(position);
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${ApiKey}`;

            // Get city name from coordinates using reverse coding api
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                // console.log(data);
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude)
            }).catch(() => {
                alert("An error occurred while fetching the city..!")
            })
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access..")
            };
        }
    )
}

locationButton.addEventListener("click", getUserInput)
searchButton.addEventListener("click", getCityInput)
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityInput())
