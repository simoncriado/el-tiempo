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
    console.log(json);
  })
  .catch(function (error) {
    console.log("Request failed: " + error.message);
  });

// First we fetch all "cities"
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
  })
  .catch(function (error) {
    console.log("Request failed: " + error.message);
  });

const searchForm = (municipios) => {
  cityForm.addEventListener("submit", (e) => {
    // Prevent default action
    e.preventDefault();

    // We display in the HTML template the city name we have searched
    const cityName = document.querySelector(".city");

    // Get search value
    const city = cityForm.city.value.trim();
    cityForm.reset();

    // We loop through all cities and if the cityName is equal to the search input we fire the fetchPrediccionMunicipio (pasing the city code)
    // If the search does not work we display the error message
    for (const key in municipios) {
      if (municipios[key].nom.trim().toLowerCase() === city.toLowerCase()) {
        containerError.classList.add("d-none");
        cityName.innerHTML = municipios[key].nom;
        codigoMunicipio = municipios[key].codi;
        console.log(`1: ${municipios[key].nom} & ${municipios[key].codi}`);
        fetchPrediccionMunicipio(codigoMunicipio);
      } else {
        containerSearch.classList.add("d-none");
        containerError.classList.remove("d-none");
      }
    }
    // Set local storage
    localStorage.setItem("codigoMunicipio", codigoMunicipio);
  });
  if (localStorage.getItem("codigoMunicipio")) {
    localStorage
      .getItem("codigoMunicipio")
      .then((data) => fetchPrediccionMunicipio(data))
      .catch((err) => console.log(err));
  }
};

// In this function we fetch the forecast for a specific city (as we get the city code from the prev function)
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
      console.log(`2: we are fetching ${codigoMunicipio}`);
      console.log(prediccionMunicipio);
      // Once we have the specific city forecast we fire the function to populate the table
      // We also hide the search and error messages and show the table container
      containerSearch.classList.add("d-none");
      containerError.classList.add("d-none");
      container2.classList.remove("d-none");
      dataTable(prediccionMunicipio);
    })
    .catch(function (error) {
      console.log("Request failed: " + error.message);
    });
};

const dataTable = (prediccionMunicipio) => {
  // We get the 3 different tables
  const tbodyHoy = document.querySelector(".hoy");
  const tbodyMañana = document.querySelector(".mañana");
  const tbodyPasadoMañana = document.querySelector(".pasadoMañana");

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
  console.log(threeDays.length);
  // Error: Vigilar también si el nombre tiene tildes o simbolos

  // Loop to create the 3 tables at once
  for (i = 0; i < threeDays.length; i++) {
    const trSky = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerHTML = "Cielo";
    trSky.append(th1);
    for (const key in threeDays[i].estatCel.valors) {
      const td1 = document.createElement("td");
      td1.innerHTML = threeDays[i].estatCel.valors[key].valor;
      trSky.append(td1);
    }

    const trTemp = document.createElement("tr");
    const th2 = document.createElement("th");
    th2.innerHTML = `Temp (${threeDays[i].temp.unitat})`;
    trTemp.append(th2);
    for (const key in threeDays[i].temp.valors) {
      const td2 = document.createElement("td");
      td2.innerHTML = threeDays[i].temp.valors[key].valor;
      trTemp.append(td2);
    }

    const trRain = document.createElement("tr");
    const th3 = document.createElement("th");
    th3.innerHTML = "Lluvia (mm)";
    trRain.append(th3);
    for (const key in threeDays[i].precipitacio.valor) {
      const td3 = document.createElement("td");
      td3.innerHTML = threeDays[i].precipitacio.valor[key].valor;
      trRain.append(td3);
    }

    const trWind = document.createElement("tr");
    const th4 = document.createElement("th");
    th4.innerHTML = "Viento (km/h)";
    trWind.append(th4);
    for (const key in threeDays[i].velVent.valors) {
      const td4 = document.createElement("td");
      td4.innerHTML = threeDays[i].velVent.valors[key].valor;
      trWind.append(td4);
    }

    // If the i=0 we populate todays table, if 1 we populate tomorrows table, else we populate day after tomorrows table
    if (i === 0) {
      tbodyHoy.append(trSky, trTemp, trRain, trWind);
    } else if (i === 1) {
      tbodyMañana.append(trSky, trTemp, trRain, trWind);
    } else {
      tbodyPasadoMañana.append(trSky, trTemp, trRain, trWind);
    }
  }

  // vigilar esto, creo que ya no hace falta
  tables.forEach((t) => {
    t.classList.remove("d-none");
  });
};
