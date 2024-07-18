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
        "uuid": uuid,
        "isMessageFromAWebApp": true,
        "stage": "init",
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log("Received data:", data);

    // Check if data.body exists and is a valid JSON
    if (data.body) {
      try {
        queryElements = JSON.parse(data.body);
      } catch (jsonError) {
        console.error("JSON parsing error: ", jsonError);
        return; // Exit if JSON parsing fails
      }
      
      console.log(queryElements);
      
      // Update UI elements
      const dateSpan = document.getElementById("date");
      dateSpan.textContent = queryElements.date || "N/A";

      const timeSpan = document.getElementById("time");
      timeSpan.textContent = queryElements.time || "N/A";

      const movieSpan = document.getElementById("movie_name");
      movieSpan.textContent = queryElements.movie_name || "N/A";

      const theatreSpan = document.getElementById("theatre_name");
      theatreSpan.textContent = queryElements.theatre_name || "N/A";

      const amountSpan = document.getElementById("amount");
      amountSpan.textContent = queryElements.amount || "N/A";

      const selected_seatsSpan = document.getElementById("selected_seats");
      selected_seatsSpan.textContent = queryElements.selected_seats || "N/A";

      const redirectLink = document.getElementById("redirect-html");
      redirectLink.href = `payment_confirmation_movie.html?uuid=${encodeURIComponent(uuid)}`;

    } else {
      console.error("Response body is undefined");
    }
  } catch (error) {
    console.error("There was an error: ", error);
  }
}

fetchData(uuid);

// Obtain name and phone-number details
const guestNameElement = document.getElementById("name");
const phoneNumberElement = document.getElementById("phone-number");


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
  let paramStr = `?uuid=${encodeURIComponent(uuid)}&name=${encodeURIComponent(guestName)}&number=${encodeURIComponent(phoneNumber)}`;
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
    const redirectLink = document.getElementById("redirect-html");
    redirectLink.href = `payment_confirmation_movie.html?uuid=${encodeURIComponent(uuid)}&name=${encodeURIComponent(guestName)}&number=${encodeURIComponent(phoneNumber)}`;

  }
})