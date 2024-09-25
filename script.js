const movieName = document.getElementById('search-input')
const searchForm = document.getElementById('searchForm')
const errorMsg = document.getElementById('error-msg')

const apiKey = '' //Enter your ombd api here
async function getMovieData(title) {
    const api = `https://www.omdbapi.com/?apikey=${apiKey}&s=${title}`;
    fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data.Response == "True") {
                errorMsg.classList.add('d-none');
                const movieContainer = document.getElementById('movieContainer');
                movieContainer.innerHTML = ''; // Clear the container before adding new movies

                data.Search.forEach(movie => {
                    const card = document.createElement('div');
                    card.classList.add('card', 'border-0', 'font-poppins', 'col', 'bg-transparent');

                    // Add a spinner as a placeholder while the image loads
                    card.innerHTML = `
                        <div class="rounded-top-3" style="height: 400px;">
                            <div class="d-flex justify-content-center align-items-center w-100 h-100" id="spinner-${movie.imdbID}">
                                <div class="spinner-border" role="status"></div>
                            </div>
                            <img id="poster-${movie.imdbID}" src=${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x400.png?text=No+Image'} class="rounded-top-3 w-100 h-100 object-fit-cover d-none" alt=${movie.Title}>
                        </div>
                        <div class="card-body d-flex flex-column rounded-bottom-3 bg-dark-subtle">
                            <p class="fw-medium mb-2">${movie.Title}</p>
                            <p class="card-text" style="font-size: 14px;"> ${movie.Year} | ${movie.Type} </p>
                            <button class="btn btn-dark rounded-3 w-100 btn-sm mt-auto" onclick="getMovieDetails('${movie.imdbID}')" data-bs-toggle="modal" data-bs-target="#modal">More Info</button>
                        </div>
                    `;
                    movieContainer.appendChild(card);

                    const moviePoster = document.getElementById(`poster-${movie.imdbID}`);
                    const spinner = document.getElementById(`spinner-${movie.imdbID}`);

                    // Event listener to show poster after it loads and remove spinner
                    moviePoster.onload = () => {
                        spinner.classList.add('d-none'); // Hide the spinner
                        moviePoster.classList.remove('d-none'); // Show the poster
                    };

                    // In case the image fails to load
                    moviePoster.onerror = () => {
                        spinner.classList.add('d-none'); // Hide the spinner
                        moviePoster.src = 'https://via.placeholder.com/300x400.png?text=No+Image'; // Show placeholder image
                        moviePoster.classList.remove('d-none'); // Show the placeholder image
                    };
                });
            } else {
                errorMsg.classList.remove('d-none');
                console.log('Error in response:', data.Error);
            }
        })
        .catch(error => console.log('Error:', error));
}

getMovieData('avengers')

// Fetch individual movie details by imdbID for modal display
function getMovieDetails(imdbID) {
    const modalBody = document.getElementById('modal-body')
    modalBody.innerHTML = `
    <div class="d-flex justify-content-center w-100">
        <div class="spinner-border" role="status">
        </div>
    </div>`
    const api = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`
    fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data.Response == "True") {
                // console.log('Details:', data)

                modalBody.innerHTML = `
                    <img
                        src=${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x400.png?text=No+Image'}
                        alt="" style="width: max-content; height: max-content;">
                    <div>
                        <p><b>Title:</b> ${data.Title}</p>
                        <p><b>Year:</b> ${data.Year}</p>
                        <p><b>Genre:</b> ${data.Genre}</p>
                        <p><b>Director:</b> ${data.Director}</p>
                        <p><b>Actors:</b> ${data.Actors}</p>
                        <p><b>Plot:</b> ${data.Plot}</p>
                    </div>
                `

            } else {
                modalBody.innerHTML = '<p class = "text-center fs-4 fw-medium text-danger m-4" >Movie details not available</p>'
                console.log('Error in response:', data.Error);
            }
        })
        .catch(error => console.log('Error:', error))
}

// Event listener for search form
searchForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const movieTitle = movieName.value
    getMovieData(movieTitle)
})