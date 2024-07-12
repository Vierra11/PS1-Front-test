$(document).ready(function() {
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

    const queryElements = getQueryParams();

    // Change the date and time span
    const dateTimeSpan = document.getElementById("date_time");
    dateTimeSpan.textContent = `${queryElements.date} , ${queryElements.time}`;

    // Change the movie details
    const movieSpan = document.getElementById("movie_name");
    movieSpan.textContent = `${queryElements.movieName}`;

    // Change the theatre details
    const theatreSpan = document.getElementById("theatre_name");
    theatreSpan.textContent = `${queryElements.theatreName}`;
});
