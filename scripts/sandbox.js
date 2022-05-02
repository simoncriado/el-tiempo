const clockNode = document.querySelector("#clock");
const dateNode = document.querySelector("#date");

const movingFocus = () => {
  // Every second we fire this code
  return setInterval(() => {
    // We get the current todays date and format it to display the time
    let actualDate = new Date();
    let actualTick = actualDate.toLocaleTimeString();
    clockNode.textContent = actualTick;

    // We get the current date and format it to display the date
    const date = `${actualDate.getDate()}-${
      actualDate.getMonth() + 1
    }-${actualDate.getFullYear()}`;
    dateNode.textContent = date;

    // From the current date we extract the hours
    currentHour = actualDate.getHours();

    // We target all hours (0-23) in todays forecast table
    const todayTableHours = document.querySelectorAll(".todayHours");
    const todayTable = document.querySelector(".hoy");
    const allHours = document.querySelectorAll("th");

    // We set the style for the headers
    allHours.forEach((hour) => {
      hour.classList.add("text-center", "align-middle");
    });
    // We loop through every hour and we check if the single hour in the table is equal to the current hour and also if the today table is populated
    // If so we add the class focus to display the green highlight on the current today´s hour
    todayTableHours.forEach((hour) => {
      hour.classList.remove("focus");
      if (hour.innerText == `${currentHour}h` && todayTable.innerHTML != "") {
        hour.classList.add("focus");
      }
    });
  }, 1000);
};

movingFocus();
