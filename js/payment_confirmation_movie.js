const WEBHOOK = "https://istzsvbhkf.execute-api.ap-south-1.amazonaws.com/test";

function getQueryParams() {
  const params = {};
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      const [key, value] = item.split("=");
      if (key) params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
    });
  return params;
}

const queryElements = getQueryParams()

const first = document.querySelector(".first");
const second = document.querySelector(".second");

// Hardcode the first two steps as being successful
first.classList.add("active");
second.classList.add("active");

// Update the contents of warnMsg
const warnMsg = document.getElementById("warn-msg")
warnMsg.textContent = `Your payment was successfully processed. You may scan the QR code to keep a copy of your details.The tickets will be booked shortly`

// Add an image
const imgElement = document.getElementById("barcode")
const data = JSON.stringify(queryElements)
imgElement.src = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&amp;size=50x50`;

async function sendData(uuid, name, number) {
  try {
    const response = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "isMessageFromAWebApp": true,
        "stage": "final",
        "uuid": uuid,
        "append": {
          "name": name,
          "number": number,
        }
      })
    });

    if (!response.ok) {
      throw new response("Network response was not ok " + response.statusText)
    } else {
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error("There was an error: ", error);
  }
}

sendData(queryElements.uuid, queryElements.name, queryElements.number);
