// Example request: http://localhost:8080/?uuid=<ID>

const WEBHOOK = "https://istzsvbhkf.execute-api.ap-south-1.amazonaws.com/test";

function getQueryParams() {
  const params = {};
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      const [key, value] = item.split("=");
      if (key) params[key] = decodeURIComponent(value);
    });
  return params;
}

const uuid = getQueryParams().uuid;
let queryElements;

async function fetchData(uuid) {
  try {
    const response = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "isMessageFromAWebApp": true,
        "stage": "init",
        "uuid": uuid
      })
    });

    if (!response.ok) {
      throw new response("Network response was not ok " + response.statusText)
    } else {
      const data = await response.json();
      queryElements = JSON.parse(data.body);
      console.log(queryElements);
      // Change the date span
      const dateSpan = document.getElementById("date");
      dateSpan.textContent = `${queryElements.date}`;

      // Change the time span
      const timeSpan = document.getElementById("time");
      timeSpan.textContent = `${queryElements.time}`;

      // Change the movie details
      const movieSpan = document.getElementById("movie_name");
      movieSpan.textContent = `${queryElements.movieName}`;

      // Change the theatre details
      const theatreSpan = document.getElementById("theatre_name");
      theatreSpan.textContent = `${queryElements.theatreName}`;

      const amountSpan = document.getElementById("amount");
      amountSpan.textContent = `${queryElements.amount}`;

      const selected_seatsSpan = document.getElementById("selected_seats");
      selected_seatsSpan.textContent = `${queryElements.selected_seats}`;

    }
  } catch (error) {
    console.error("There was an error: ", error);
  }
}

fetchData(uuid);

// Obtain name and phone-number details
const guestNameElement = document.getElementById("name");
const phoneNumberElement = document.getElementById("phone-number");

let guestName = "";
let phoneNumber = "";

guestNameElement.addEventListener("input", (event) => {
  guestName = event.target.value;
})

phoneNumberElement.addEventListener("input", (event) => {
  phoneNumber = event.target.value;
})

// Append parameters to the redirect URL
const redirectElement = document.getElementById("redirect-html")
const errorElement = document.getElementById("error-msg");
redirectElement.addEventListener("click", (event) => {
  let paramStr = `?uuid=${encodeURIComponent(uuid)}&name=${encodeURIComponent(guestName)}&number=${encodeURIComponent(phoneNumber)}&guestCount=${encodeURIComponent(guestCount)}`;
  if (guestName === "") {
    event.preventDefault()
    errorElement.classList.add("active")
    errorElement.textContent = "Please enter your name";
  } else if (phoneNumber.length != 10 || isNaN(phoneNumber) || isNaN(parseFloat(phoneNumber))) {
    event.preventDefault()
    errorElement.classList.add("active")
    errorElement.textContent = "Please enter a valid number";
  } else {
    redirectElement.href += paramStr;
  }
})
