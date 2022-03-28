//  degree char


function getData(cityName) {
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
            displayData(locationData, weatherData);
          })
      }
      else {
        alert("Error retrieving data.");
      }
    })
}

function displayData(locationData, weatherData) {
  console.log(locationData);
  console.log(weatherData);
  var currDate = dayjs().format("MMMM D, YYYY");
  var currIcon = weatherData.current.weather[0].icon;
  // setting section title
  document.getElementById("curr-city")
    .innerHTML = `
      ${locationData.name} 
      ${currDate} 
      <img src=http://openweathermap.org/img/wn/${currIcon}@2x.png alt="" />
    `;
  // setting section data
  document.getElementById("curr-temp")
    .textContent = `Temp: ${weatherData.current.temp} \u00B0F`;
  document.getElementById("curr-wind")
    .textContent = `Wind: ${weatherData.current.wind_speed} MPH`;
  document.getElementById("curr-humidity")
    .textContent = `Humidity: ${weatherData.current.humidity} %`;
  document.getElementById("curr-uv")
    .textContent = `UV index: ${weatherData.current.uvi}`;
}

getData("Toronto");
