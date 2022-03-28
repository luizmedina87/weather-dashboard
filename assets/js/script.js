// INSERT ALT TO IMAGES


function getData() {
  var userInput = document.getElementById("city-search").value.trim();
  cityName = (!userInput) ? "Toronto" : userInput;
  var apiUrl = (
    `https://api.openweathermap.org/geo/1.0/direct?`
    + `q=${cityName}&`
    + `limit=1`
    + `&appid=f025109bb94217f8061a8979f6fba37b`
  );
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json()
          .then(function(data) {
            getWeather(data[0]);
          })
      }
      else {
        alert("Error retrieving data.");
      }
    }
  );
}

function getWeather(locationData) {
  var apiUrl = (
    `https://api.openweathermap.org/data/2.5/onecall?`
    + `lat=${locationData.lat}&`
    + `lon=${locationData.lon}&`
    + `exclude=minutely,hourly`
    + `&appid=f025109bb94217f8061a8979f6fba37b`
  );
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json()
          .then(function(weatherData) {
            displayCurrentData(locationData, weatherData);
            displayforecasts(weatherData);
          })
      }
      else {
        alert("Error retrieving data.");
      }
    })
}

function displayCurrentData(locationData, weatherData) {
  var currDate = 
    dayjs(weatherData.current.dt * 1000)
      .format("MMMM D, YYYY");
  var currIcon = weatherData.current.weather[0].icon;
  // setting section title
  document.getElementById("curr-city")
    .innerHTML = `
      ${locationData.name} 
      ${currDate} 
      <img src="http://openweathermap.org/img/wn/${currIcon}@2x.png" />
    `;
  // setting section data
  document.getElementById("curr-temp")
    .textContent = `Temp: ${weatherData.current.temp} \u00B0F`;
  document.getElementById("curr-wind")
    .textContent = `Wind: ${weatherData.current.wind_speed} MPH`;
  document.getElementById("curr-humidity")
    .textContent = `Humidity: ${weatherData.current.humidity}%`;
  document.getElementById("curr-uv")
    .textContent = `UV index: ${weatherData.current.uvi}`;
}

function displayforecasts(weatherData) {
  // clear previous elements
  var forecastEl = document.getElementById("forecast-cards");
  forecastEl.innerHTML = "";
  // create new elements
  for (let i = 1; i < 6; i++) {
    // extracting data
    var forecast = weatherData.daily[i];
    var fcstIcon = forecast.weather[0].icon;
    // creating html elements
    var fcstCardEl = document.createElement("div");
    var cardTitleEl = document.createElement("h3");
    var cardIconEl = document.createElement("img");
    var cardTempEl = document.createElement("p");
    var cardWindEl = document.createElement("p");
    var cartHumidityEl = document.createElement("p");
    // inserting data into elements
    cardTitleEl.textContent = 
      dayjs(forecast.dt * 1000)
        .format("MMM D, YYYY");
    cardIconEl.setAttribute("src", `http://openweathermap.org/img/wn/${fcstIcon}@2x.png`);
    cardTempEl.textContent = `${forecast.temp.day} \u00B0F`;
    cardWindEl.textContent = `${forecast.wind_speed} MPH`;
    cartHumidityEl.textContent = `${forecast.humidity}%`;
    // appending data
    fcstCardEl.appendChild(cardTitleEl);
    fcstCardEl.appendChild(cardIconEl);
    fcstCardEl.appendChild(cardTempEl);
    fcstCardEl.appendChild(cardWindEl);
    fcstCardEl.appendChild(cartHumidityEl);
    forecastEl.appendChild(fcstCardEl);
  }
}

getData();

document
  .getElementById("search-btn")
  .addEventListener("click", getData);