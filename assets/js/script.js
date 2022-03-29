function getData() {
  var searchEl = document.getElementById("city-search");
  var userInput = searchEl.value.trim();
  cityName = (!userInput) ? "toronto" : userInput.toLowerCase();
  var apiUrl = (
    `https://api.openweathermap.org/geo/1.0/direct?`
    + `q=${cityName}&`
    + `limit=1`
    + `&appid=f025109bb94217f8061a8979f6fba37b`
  );
  try {
    fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json()
            .then(function(data) {
              getWeather(userInput, data[0]);
            })
        }
        else {
          alert("Error retrieving data.");
        }
      }
    );
  }
  catch {
    alert("Something went wrong. Check your spelling for the city");
  }
  // reseting field
  searchEl.value = "";
}

function getWeather(userInput, locationData) {
  try {
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
              saveLocation(userInput);
              makebuttons();
            })
        }
        else {
          alert("Error retrieving data.");
        }
      }
    );
  }
  catch {
    alert("Something went wrong. Check your spelling for the city");
  }
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
      <img src="https://openweathermap.org/img/wn/${currIcon}@2x.png" alt="" />
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
  uvColorScale(weatherData.current.uvi);
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
    var cardBody = document.createElement("div");
    var cardTempEl = document.createElement("p");
    var cardWindEl = document.createElement("p");
    var cartHumidityEl = document.createElement("p");
    // adding style
    fcstCardEl.className = "col card bg-dark bg-opacity-50 text-white";
    cardTitleEl.className = "card-title";
    cardIconEl.className = "card-img";
    // inserting data into elements
    cardTitleEl.textContent = 
      dayjs(forecast.dt * 1000)
        .format("MMM D, YYYY");
    cardIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${fcstIcon}@2x.png`);
    cardIconEl.setAttribute("alt", "");
    cardTempEl.textContent = `${forecast.temp.day} \u00B0F`;
    cardWindEl.textContent = `${forecast.wind_speed} MPH`;
    cartHumidityEl.textContent = `${forecast.humidity}%`;
    // appending data
    fcstCardEl.appendChild(cardTitleEl);
    fcstCardEl.appendChild(cardIconEl);
    cardBody.appendChild(cardTempEl);
    cardBody.appendChild(cardWindEl);
    cardBody.appendChild(cartHumidityEl);
    fcstCardEl.appendChild(cardBody);
    forecastEl.appendChild(fcstCardEl);
  }
}

function saveLocation(userInput) {
  // only saves if entered
  if (userInput) {
    // sets to lowercase before saving to prevent duplicates
    userInput = userInput.toLowerCase();
    // saves in set
    var savedCities = localStorage.getItem("citiesSet");
    savedCities = JSON.parse(savedCities);
    if (!savedCities) {
      savedCities = [userInput];
    }
    else {
      savedCities.push(userInput);
    }
    var citiesSet = new Set([...savedCities]);
    localStorage.setItem("citiesSet", JSON.stringify([...citiesSet]));
  }
}

function makebuttons() {
  // clear items
  var citiesBtnsEl = document.getElementById("cities-btns");
  citiesBtnsEl.innerHTML = "";
  // make new ones
  var savedCities = localStorage.getItem("citiesSet");
  if (!savedCities) {return}
  savedCities = JSON.parse(savedCities);
  savedCities.forEach(city => {
    var btnEl = document.createElement("button");
    btnEl.textContent = properStr(city);
    btnEl.setAttribute("id", city);
    btnEl.className = "btn btn-outline-info";
    citiesBtnsEl.appendChild(btnEl);
    document.getElementById(city).addEventListener("click", clickBtn);
  })
}

function clickBtn() {
  var searchEl = document.getElementById("city-search");
  console.log(this.id);
  searchEl.value = this.id;
  getData();
}

function uvColorScale(index) {
  var color;
  if (index < 2) {
    color = "green";
  }
  else if (index < 4) {
    color = "yellow";
  }
  else {
    color = "red";
  }
  getElementById = document.getElementById("curr-uv").style.color = color;
}

function properStr(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' ');
}

// calling function on page load
getData();
makebuttons();

// dealing with user input
document
  .getElementById("search-btn")
  .addEventListener("click", getData);
