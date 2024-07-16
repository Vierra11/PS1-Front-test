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
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log("Received data:", data); // Log the entire data object

    // Check if data.body exists and is a valid JSON
    if (data.body) {
      try {
        queryElements = JSON.parse(data.body);
        console.log("Parsed queryElements:", queryElements); // Log the parsed object
      } catch (jsonError) {
        console.error("JSON parsing error: ", jsonError);
        return; // Exit if JSON parsing fails
      }
      
      // Update UI elements
      const dateSpan = document.getElementById("date");
      dateSpan.textContent = queryElements.date || "N/A";

      const timeSpan = document.getElementById("time");
      timeSpan.textContent = queryElements.time || "N/A";

      const movieSpan = document.getElementById("movie_name");
      movieSpan.textContent = queryElements.movieName || "N/A";

      const theatreSpan = document.getElementById("theatre_name");
      theatreSpan.textContent = queryElements.theatreName || "N/A";

      const amountSpan = document.getElementById("amount");
      amountSpan.textContent = queryElements.amount || "N/A";

      const selected_seatsSpan = document.getElementById("selected_seats");
      selected_seatsSpan.textContent = queryElements.selected_seats || "N/A";

    } else {
      console.error("Response body is undefined");
    }
  } catch (error) {
    console.error("There was an error: ", error);
  }
}
