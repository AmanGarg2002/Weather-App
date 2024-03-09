const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-conatiner"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoConatiner = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "779390317a69120c1acf88ff067e0b5d";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoConatiner.classList.remove("active"); //doubt hai error aayega isme maybe
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoConatiner.classList.remove("active");
      // grantAccessContainer.classList.add("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates"); //gelocation mai mtb user-coordinates mai long and lat save hoga

  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  grantAccessContainer.classList.remove("active");

  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoConatiner.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");

    console.log(
      "ENABLE TO FETCH THE DATA KINDLY RETRY OR COME AFTER SOME TIME TO CHCECK THE DATA CORRESPONDING TO THE LONFGITIUTE ANF LATITUDE ACCORDING TO YOUR LOACTION",
      err
    );
    
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-city-name]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humiditiy]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`; //maybe wn vala error aayega
  temp.innerText = weatherInfo?.main?.temp + " °C";
  windspeed.innerText = weatherInfo?.wind?.speed + "ms";
  humidity.innerText = weatherInfo?.main?.humidity + "%";
  cloudiness.innerText = weatherInfo?.clouds?.all + "%";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert(
      "NO GEOLOACTION IS SUPPORT SOO NOT ABLE TO GET THE LOACTION TO TRACK THE WEATHER CONDITION ARROOUNF YOU"
    );
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);
console.log("clicked");

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === " ") {
    return;
  } else {
    fetchSerachInfoWeather(cityName);
  }
});

const errorBox = document.querySelector(".errorNew");

async function fetchSerachInfoWeather(city) {
  loadingScreen.classList.add("active");
  userInfoConatiner.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (response.ok) {
      const data = await response.json();
      loadingScreen.classList.remove("active");
      errorBox.classList.remove("active");
      userInfoConatiner.classList.add("active");

      renderWeatherInfo(data);
    } else {
      throw new Error("NOT FOUND");
    }
  } catch (err) {
    loadingScreen.classList.remove("active");
    userInfoConatiner.classList.remove("active");
    errorBox.classList.add("active");
  }
}
