//Imports of other modules
import { getCountries, saveHomeLocation, getWeatherData, getCityName } from "./apicalls";
import { displayCurrentWeatherData } from "./updatedom";

// DOM Handles
const getLocDH = document.querySelector(".getlocation");
const cardBodyDH = document.querySelector(".card");
const footerDH = document.querySelector(".footer");
const modalBodyDH = document.querySelector(".modal-body");
const modalSaveDH = document.querySelector(".modal-save");
const modalSearchDH = document.querySelector(".modal-search");
const modalCities = document.querySelector(".modal-cities");
const apifailedDH = document.querySelector(".apifailed");
const countryDropDownDH = document.querySelector(".country");
const findmeBtnDH = document.querySelector(".getlocation button");
const lds_hourglass = document.querySelector(".lds-hourglass");
const tabcontent = document.querySelector(".tab-content");

//Reset Home
$("#reset-home").on("click", e => {
  e.preventDefault();
  if (localStorage.getItem("HomeLocation")) {
    localStorage.removeItem("HomeLocation");
    location.reload();
  }
});

//Update Settings Data
if (localStorage.getItem("Units")) {
  const units = JSON.parse(localStorage.getItem("Units"));
  if (units.tunit == "f") {
    $("#farht").attr("checked", true);
  } else {
    $("#centigrade").attr("checked", true);
  }
  if (units.dunit == "ft") {
    $("#feet").attr("checked", true);
  } else {
    $("#meters").attr("checked", true);
  }
} else {
  $("#centigrade").attr("checked", true);
  $("#meters").attr("checked", true);
}

$("#save-settings").on("click", e => {
  e.preventDefault();
  const changedSettings = {
    tunit: $('input[name="tunits"]:checked').val(),
    dunit: $('input[name="dunits"]:checked').val()
  };
  localStorage.setItem("Units", JSON.stringify(changedSettings));
  location.reload();
});

//Global URLS
const countryJsonURL = "./server/country_codes.json";

//Tooltip initialization
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//Check Locally Stored Data. Store only what you need.
const homeLocation = JSON.parse(localStorage.getItem("HomeLocation"));

//First Register User Location Manually
if (!homeLocation) {
  $(".city-title").text("Choose Your Home Location");
  $(".nav").addClass("d-none");
  lds_hourglass.classList.add("d-none");
  getCountries(countryJsonURL)
    .then(countrylist => {
      let countries = "<option selected>Choose Your Country</option>";
      for (let i = 0; i < countrylist.length; i++) {
        countries += `            
            <option value="${i}">${countrylist[i].name}</option>`;
      }
      countryDropDownDH.innerHTML = countries;
      let rx_result = false;
      const ziccodePattern = /^.[a-z0-9A-Z]{2,9}$/;
      getLocDH.addEventListener("keyup", () => {
        rx_result = ziccodePattern.test(getLocDH.zipcode.value);
        if (rx_result) {
          findmeBtnDH.classList.remove("disabled");
        } else {
          findmeBtnDH.classList.add("disabled");
        }
      });
      getLocDH.addEventListener("submit", e => {
        e.preventDefault();
        if (!rx_result) return;
        let uLocation = {
          zipcode: getLocDH.zipcode.value,
          abbr: countrylist[getLocDH.country.value].abbr
        };
        saveHomeLocation(uLocation.zipcode, uLocation.abbr)
          .then(data => {
            let homeLocation = {
              lat: data.lat.toFixed(2),
              lon: data.lon.toFixed(2)
            };
            localStorage.setItem("HomeLocation", JSON.stringify(homeLocation));
            if (!localStorage.getItem("Units")) {
              localStorage.setItem("Units", JSON.stringify({ tunit: "C", dunit: "mt" }));
            }
            homeLocation = JSON.parse(localStorage.getItem("HomeLocation"));
            getLocDH.remove();
            $(".nav").removeClass("d-none");
            getLocation();
          })
          .catch(err => {
            apifailedDH.innerHTML = "Is that code in the country you have selected? " + err.message;
            setTimeout(() => {
              apifailedDH.innerHTML = "";
            }, 3000);
          });
      });
    })
    .catch(err => {
      console.log("Error:" + err.message);
    });
} else {
  getLocDH.remove();
  $(".nav").removeClass("d-none");
  getLocation();
}

//Get the permission for location tracking from the user
const options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

function getLocation() {
  $(".city-title").text("Allow this app to get your location..");
  if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(onMove,atHomeLoc,options);
    navigator.geolocation.getCurrentPosition(onMove, atHomeLoc, options);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

//Based on user decision perform below tasks
const getWeatherPageData = (lat, lon) => {
  // get the local city name
  getCityName(lat, lon)
    .then(cDets => {
      //Change the Weather Page title to the user city
      $(".city-title").text(cDets[0].name + ", " + cDets[0].state);
      //Check Away from or At Home Location
      let homeLocation = JSON.parse(localStorage.getItem("HomeLocation"));
      if (Math.abs(lat - homeLocation.lat) <= 0.5 && Math.abs(lon - homeLocation.lon) <= 0.5) {
        $(".current-loc").text("(At Home)");
      } else {
        $(".current-loc").text("(Away From Home)");
      }
    })
    .catch(err => {
      console.log("Error fetching City details: " + err.message);
    });

  // get full weather data
  getWeatherData(lat, lon)
    .then(cwdata => {
      lds_hourglass.classList.add("d-none");
      tabcontent.classList.remove("d-none");
      displayCurrentWeatherData(cwdata);
    })
    .catch(err => {
      console.log("Error Receiving Weather Data from OpenWeather: " + err.message);
    });
};

function onMove(position) {
  $(".city-title").text("Finding your location...");
  let uLocation = {
    lat: position.coords.latitude.toFixed(2),
    lon: position.coords.longitude.toFixed(2)
  };
  getWeatherPageData(uLocation.lat, uLocation.lon);
}

function atHomeLoc(error) {
  $(".city-title").text("Finding your location...");
  // Handle gps error codes
  // switch(error.code) {
  //     case error.PERMISSION_DENIED:
  //       apifailedDH.innerHTML = "User denied the request for Geolocation."
  //       break;
  //     case error.POSITION_UNAVAILABLE:
  //       apifailedDH.innerHTML = "Location information is unavailable."
  //       break;
  //     case error.TIMEOUT:
  //       apifailedDH.innerHTML = "The request to get user location timed out."
  //       break;
  //     case error.UNKNOWN_ERROR:
  //       apifailedDH.innerHTML = "An unknown error occurred."
  //       break;
  //   }
  let homeLocation = JSON.parse(localStorage.getItem("HomeLocation"));
  getWeatherPageData(homeLocation.lat, homeLocation.lon);
}
