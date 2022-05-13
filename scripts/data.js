const key = "VPpWII3CwC1th0Y19spcK9848kRBTAj68nRPjUW3";
const cityForm = document.querySelector("form");

// Small logic to check if the table is populated. If not we display a message for the user to search for a city
const tbodyHoy = document.querySelector(".hoy");
const container2 = document.querySelector(".container2");
const containerSearch = document.querySelector(".containerSearch");
const containerError = document.querySelector(".containerError");
if (!tbodyHoy.innerHTML) {
  containerSearch.classList.remove("d-none");
  container2.classList.add("d-none");
}

// Fetch para saber cuantas consultas hemos hecho / nos quedan
fetch("https://api.meteo.cat/quotes/v1/consum-actual", {
  method: "GET",
  headers: {
    "X-API-key": key,
  },
})
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(function (json) {
    const data = json
  })
  .catch(function (error) {
    console.log("Request failed: " + error.message);
  });

// Fetch to get all "sky symbols"
// If stored in localStorage we get the symbols
if (localStorage.getItem("simbolos")) {
  const simbolosLocalStorage = localStorage.getItem("simbolos");
  const simbolos = JSON.parse(simbolosLocalStorage);
  // If not stored yet we fetch the symbols and then save them in localStorage
} else {
  fetch("https://api.meteo.cat/referencia/v1/simbols", {
    method: "GET",
    headers: {
      "X-API-key": key,
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function (json) {
      simbolos = json;
      // Set local storage
      localStorage.setItem("simbolos", JSON.stringify(simbolos));
    })
    .catch(function (error) {
      console.log("Request failed: " + error.message);
    });
}

// Function to populate the forecast tables
const dataTable = (prediccionMunicipio) => {
  // We get the 3 different tables
  const tbodyHoy = document.querySelector(".hoy");
  const tbodyMañana = document.querySelector(".mañana");
  const tbodyPasadoMañana = document.querySelector(".pasadoMañana");

  // We get the sky symbols from localStorage
  const simbolosLocalStorage = localStorage.getItem("simbolos");
  const simbolos = JSON.parse(simbolosLocalStorage);

  // We reset the t-bodies in case the user searches a new city. Otherwise the tables get duplicated (or more...)
  tbodyHoy.innerHTML = "";
  tbodyMañana.innerHTML = "";
  tbodyPasadoMañana.innerHTML = "";

  // We separate the variables for the 3 days
  const forecastDays = prediccionMunicipio.dies;
  const threeDays = [
    forecastDays[0].variables,
    forecastDays[1].variables,
    forecastDays[2].variables,
  ];

  // Loop to create the 3 tables at once
  for (i = 0; i < threeDays.length; i++) {
    // Sky row
    const trSky = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerHTML = "Cielo";
    trSky.append(th1);
    for (const key in threeDays[i].estatCel.valors) {
      const td1 = document.createElement("td");
      const img = document.createElement("img");
      td1.classList.add("text-center", "h-100");
      const valorCielo = threeDays[i].estatCel.valors[key].valor;
      // Conditional to check if night time and then show the night icons, otherwise show the day icons
      if (key <= 6) {
        for (const key in simbolos[0].valors) {
          if (simbolos[0].valors[key].codi == valorCielo) {
            img.src = simbolos[0].valors[key].icona_nit;
            img.classList.add("h-100", "my-auto");
          }
        }
      } else if (key >= 21) {
        for (const key in simbolos[0].valors) {
          if (simbolos[0].valors[key].codi == valorCielo) {
            img.src = simbolos[0].valors[key].icona_nit;
            img.classList.add("h-100", "my-auto");
          }
        }
      } else {
        for (const key in simbolos[0].valors) {
          if (simbolos[0].valors[key].codi == valorCielo) {
            img.src = simbolos[0].valors[key].icona;
            img.classList.add("h-100", "my-auto");
          }
        }
      }
      td1.append(img);
      trSky.append(td1);
    }

    // Temperature row
    const trTemp = document.createElement("tr");
    const th2 = document.createElement("th");
    th2.innerHTML = `Temp (${threeDays[i].temp.unitat})`;
    trTemp.append(th2);
    for (const key in threeDays[i].temp.valors) {
      const td2 = document.createElement("td");
      td2.classList.add("text-center", "align-middle");
      td2.innerHTML = Math.round(threeDays[i].temp.valors[key].valor);
      trTemp.append(td2);
    }

    // Rain row
    const trRain = document.createElement("tr");
    const th3 = document.createElement("th");
    th3.innerHTML = "Lluvia (mm)";
    trRain.append(th3);
    for (const key in threeDays[i].precipitacio.valor) {
      const td3 = document.createElement("td");
      td3.classList.add("text-center", "align-middle");
      td3.innerHTML = Math.round(threeDays[i].precipitacio.valor[key].valor);
      trRain.append(td3);
    }

    // Wind row
    const trWind = document.createElement("tr");
    const th4 = document.createElement("th");
    th4.innerHTML = "Viento (km/h)";
    trWind.append(th4);
    for (const key in threeDays[i].velVent.valors) {
      const td4 = document.createElement("td");
      td4.classList.add("text-center", "align-middle");
      td4.innerHTML = Math.round(threeDays[i].velVent.valors[key].valor);
      trWind.append(td4);
    }

    // If i=0 we populate todays table, if 1 we populate tomorrows table, else we populate day after tomorrows table
    if (i === 0) {
      tbodyHoy.append(trSky, trTemp, trRain, trWind);
    } else if (i === 1) {
      tbodyMañana.append(trSky, trTemp, trRain, trWind);
    } else {
      tbodyPasadoMañana.append(trSky, trTemp, trRain, trWind);
    }
  }
};

// If city forecast already stored in localStorage we get it and then fire the dataTable function
if (localStorage.getItem("prediccionMunicipio")) {
  const prediccionMunicipio = localStorage.getItem("prediccionMunicipio");
  containerSearch.classList.add("d-none");
  containerError.classList.add("d-none");
  container2.classList.remove("d-none");
  dataTable(JSON.parse(prediccionMunicipio));
}
// In this function we fetch the forecast for a specific city (as we get the city code from the prev function (or from localStorage))
const fetchPrediccionMunicipio = (codigoMunicipio) => {
  fetch(
    `https://api.meteo.cat/pronostic/v1/municipalHoraria/${codigoMunicipio}`,
    {
      method: "GET",
      headers: {
        "X-API-key": key,
      },
    }
  )
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function (json) {
      prediccionMunicipio = json;
      // Once we have the specific city forecast we fire the function to populate the table
      // We also hide the search and error messages and show the table container
      containerSearch.classList.add("d-none");
      containerError.classList.add("d-none");
      container2.classList.remove("d-none");
      dataTable(prediccionMunicipio);

      // Set local storage
      localStorage.setItem(
        "prediccionMunicipio",
        JSON.stringify(prediccionMunicipio)
      );
    })
    .catch(function (error) {
      console.log("Request failed: " + error.message);
    });
};

// Only if city code IS stored in localStorage and city forecast IS NOT stored we fire the get city forecast function
if (
  localStorage.getItem("codigoMunicipio") &&
  !localStorage.getItem("prediccionMunicipio")
) {
  const codigoMunicipio = localStorage.getItem("codigoMunicipio");
  fetchPrediccionMunicipio(codigoMunicipio);
}

// Search functionality
const searchForm = (municipios) => {
  cityForm.addEventListener("submit", (e) => {
    // Prevent default action
    e.preventDefault();

    containerSearch.classList.add("d-none");
    containerError.classList.add("d-none");

    // We display in the HTML template the city name we have searched
    const cityName = document.querySelector(".city");

    // Get search value (trimming empty spaces, lower case and replacing special signs `´ñ etc for normal letters)
    const city = cityForm.city.value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    cityForm.reset();

    // Const to check if the search returned any result
    const searchSuccess = [];

    // We loop through all cities and if the cityName is equal to the search input we fire the fetchPrediccionMunicipio (pasing the city code)
    for (const key in municipios) {
      if (
        municipios[key].nom
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") === city
      ) {
        // If result we push it to the searchSuccess const
        searchSuccess.push(key);
        nombreMunicipio = municipios[key].nom;
        cityName.innerHTML = nombreMunicipio;
        codigoMunicipio = municipios[key].codi;
        fetchPrediccionMunicipio(codigoMunicipio);

        // Set local storage
        localStorage.setItem("codigoMunicipio", codigoMunicipio);
        localStorage.setItem("nombreMunicipio", nombreMunicipio);
      }
    }

    // If the search was not successfull we display the error message
    if (searchSuccess.length == 0) {
      container2.classList.add("d-none");
      containerSearch.classList.add("d-none");
      containerError.classList.remove("d-none");
    }
  });
};

// Fetch to get all "cities". If stored in localStorage we get it from there. Otherwise we fetch it (and then save it into localStorage)
if (localStorage.getItem("municipios")) {
  const municipios = localStorage.getItem("municipios");
  searchForm(JSON.parse(municipios));
} else {
  fetch("https://api.meteo.cat/referencia/v1/municipis", {
    method: "GET",
    headers: {
      "X-API-key": key,
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function (json) {
      municipios = json;
      // Once we have all cities we fire the search function
      searchForm(municipios);
      // Set local storage
      localStorage.setItem("municipios", JSON.stringify(municipios));
    })
    .catch(function (error) {
      console.log("Request failed: " + error.message);
    });
}

// Logic to check if we have a cityName stored in localStorage
if (localStorage.getItem("nombreMunicipio")) {
  // We display in the HTML template the city name we have searched
  const cityName = document.querySelector(".city");
  const nombreMunicipio = localStorage.getItem("nombreMunicipio");
  cityName.innerHTML = nombreMunicipio;
}
