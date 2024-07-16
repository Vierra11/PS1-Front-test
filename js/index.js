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
    console.log("Fetching data for UUID:", uuid); // Debug log

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
            throw new Error("Network response was not ok " + response.statusText);
        } else {
            const data = await response.json();
            console.log("Full response data:", data); // Debug log

            if (data.body) {
                queryElements = JSON.parse(data.body);
                console.log("Parsed queryElements:", queryElements); // Debug log

                // Change the date span
                const dateSpan = document.getElementById("date");
                dateSpan.textContent = `${queryElements.date}`;

                // Change the time span
                const timeSpan = document.getElementById("time");
                timeSpan.textContent = `${queryElements.time}`;

                // Change the movie details
                const movieSpan = document.getElementById("movie_name");
                movieSpan.textContent = `${queryElements.movie_name}`;

                // Change the theatre details
                const theatreSpan = document.getElementById("theatre_name");
                theatreSpan.textContent = `${queryElements.theatre_name}`;

                // Set price and sold seats
                window.price = parseInt(queryElements.price, 10);

                if (queryElements.sold_seats && Array.isArray(queryElements.sold_seats)) {
                    const soldSeats = queryElements.sold_seats.map(seat => seat.trim());
                    console.log("Sold seats:", soldSeats); // Debug log

                    const sc = $('#seat-map').seatCharts();
                    sc.get(soldSeats).status('unavailable');
                } else {
                    console.warn("Sold seats are undefined or not an array");
                }
            } else {
                console.error("Data body is undefined or null");
            }
        }
    } catch (error) {
        console.error("There was an error:", error);
    }
}

fetchData(uuid);
