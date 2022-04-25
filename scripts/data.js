const key = "VPpWII3CwC1th0Y19spcK9848kRBTAj68nRPjUW3";
const cityForm = document.querySelector("form");

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

    const cityName = document.querySelector(".city");

    // Get city value
    const city = cityForm.city.value.trim();
    cityForm.reset();

    // We loop through all cities and if the name is equal to the search input we fire the fetchPrediccionMunicipio (pasing the city code)
    for (const key in municipios) {
      if (municipios[key].nom.toLowerCase() === city.toLowerCase()) {
        cityName.innerHTML = municipios[key].nom;
        codigoMunicipio = municipios[key].codi;
        fetchPrediccionMunicipio(codigoMunicipio);
      }
    }
  });
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
      dataTable(prediccionMunicipio);
    })
    .catch(function (error) {
      console.log("Request failed: " + error.message);
    });
};

const dataTable = (prediccionMunicipio) => {
  const tbody = document.querySelector("tbody");
  const today = prediccionMunicipio.dies[0].variables;

  // Today´s table
  const trSky = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.innerHTML = "Cielo";
  trSky.append(th1);
  for (const key in today.estatCel.valors) {
    const td1 = document.createElement("td");
    td1.innerHTML = today.estatCel.valors[key].valor;
    trSky.append(td1);
  }

  const trTemp = document.createElement("tr");
  const th2 = document.createElement("th");
  th2.innerHTML = `Temp ${today.temp.unitat}`;
  trTemp.append(th2);
  for (const key in today.temp.valors) {
    const td2 = document.createElement("td");
    td2.innerHTML = today.temp.valors[key].valor;
    trTemp.append(td2);
  }

  const trRain = document.createElement("tr");
  const th3 = document.createElement("th");
  th3.innerHTML = "Lluvia (mm)";
  trRain.append(th3);
  for (const key in today.precipitacio.valor) {
    const td3 = document.createElement("td");
    td3.innerHTML = today.precipitacio.valor[key].valor;
    trRain.append(td3);
  }

  const trWind = document.createElement("tr");
  const th4 = document.createElement("th");
  th4.innerHTML = "Viento (km/h)";
  trWind.append(th4);
  for (const key in today.velVent.valors) {
    const td4 = document.createElement("td");
    td4.innerHTML = today.velVent.valors[key].valor;
    trWind.append(td4);
  }

  tbody.append(trSky, trTemp, trRain, trWind);
};
