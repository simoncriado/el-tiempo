const clockNode = document.querySelector("#clock");
const dateNode = document.querySelector("#date");

const movingFocus = () => {
  // We get todays date and roll the time back to 00:00:00
  let lastMidnight = new Date();
  lastMidnight.setHours(0, 0, 0, 0);

  // Every second we fire this code
  return setInterval(() => {
    // Every second we get the numeric value of the bar width
    // const timeLine = document.querySelector(".timeLine");
    // const timeLineStyle = getComputedStyle(timeLine);
    // const timeLineWidth = timeLineStyle.width;
    // const numeric = parseInt(timeLineWidth);

    // We get the current todays date and format it to display the time
    let actualDate = new Date();
    let actualTick = actualDate.toLocaleTimeString();
    clockNode.textContent = actualTick;

    const date = `${actualDate.getDate()}-${
      actualDate.getMonth() + 1
    }-${actualDate.getFullYear()}`;
    dateNode.textContent = date;

    currentHour = actualDate.getHours();

    const todayTableHours = document.querySelectorAll(".todayHours");
    const todayTable = document.querySelector(".hoy");
    todayTableHours.forEach((hour) => {
      hour.classList.remove("focus");
      if (hour.innerText == `${currentHour}h` && todayTable.innerHTML != "") {
        hour.classList.add("focus");
      }
    });

    // We calculate the amount of seconds between 00:00:00 and the current time
    // let diffMilliseconds = actualDate - lastMidnight;
    // var diffSeconds = Math.floor(
    //   ((diffMilliseconds % 86400000) / 3600000) * 3600
    // );

    // If the amount of seconds is 86400 (24h) we reset the position of the focus to start again on the left side of the bar
    // if (diffSeconds === 86400) {
    //   marginLeft = 0;
    // If the 86400 seconds are not yet reached we set the margin-left to be the amount of pixels of margin-left per second * the amount of minutes since midnight
    // } else {
    // marginLeft is equal to the width in pixels divided by the amount of seconds a day has (this to know how many pixels does the margin-left need to
    // move every second to complete the bar in 24h) multiplied by the seconds from midnight until now
    //   marginLeft = (numeric / 86400) * diffSeconds;
    // }
    // focus.style.marginLeft = `${marginLeft}px`;
  }, 1000);
};

movingFocus();
