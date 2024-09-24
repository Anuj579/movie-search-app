const movieName = document.getElementById('search-input')
const searchForm = document.getElementById('searchForm')
const moviePoster = document.getElementById('moviePoster')
const movieTitle = document.getElementById('movieTitle')
const movieYear = document.getElementById('movieYear')
const movieGenre = document.getElementById('movieGenre')
const movieDirector = document.getElementById('movieDirector')
const movieActor = document.getElementById('movieActor')
const moviePlot = document.getElementById('moviePlot')
const errorMsg = document.getElementById('error-msg')

const apiKey = '' //Enter your ombd api here
async function getMovieData(title) {
    const api = `https://www.omdbapi.com/?apikey=${apiKey}&s=${title}`
    fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data.Response == "True") {
                errorMsg.classList.add('d-none')
                // console.log(data.Search)
                const movieContainer = document.getElementById('movieContainer')
                movieContainer.innerHTML = '' // Clear the container before adding new movies

                data.Search.forEach(movie => {
                    const poster = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x400.png?text=No+Image'; // Fallback if poster not available
                    movieContainer.innerHTML += `
                    <div class="card border-0 font-poppins col bg-transparent">
                        <div class="rounded-top-3" style="height: 400px;">
                            <img src=${poster} class="rounded-top-3 w-100 h-100 object-fit-cover" alt=${movie.Title}>
                        </div>
                        <div class="card-body d-flex flex-column rounded-bottom-3 bg-dark-subtle">
                            <p class="fw-medium mb-2">${movie.Title}</p>
                            <p class="card-text" style="font-size: 14px;"> ${movie.Year} | ${movie.Type} </p>
                            <button class="btn btn-dark rounded-3 w-100 btn-sm mt-auto" onclick="getMovieDetails('${movie.imdbID}')" data-bs-toggle="modal" data-bs-target="#modal">More Info</button>
                        </div>
                    </div>
                    `

                })
            } else {
                errorMsg.classList.remove('d-none')
                console.log('Error in response:', data.Error);
            }
        })
        .catch(error => console.log('Error:', error))
}

// Fetch individual movie details by imdbID for modal display
function getMovieDetails(imdbID) {
    const api = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`
    fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data.Response == "True") {
                console.log('Details:', data)

                // Update the modal with movie details
                moviePoster.src = data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/300x400.png?text=No+Image'
                movieTitle.innerText = data.Title
                movieYear.innerText = data.Year
                movieGenre.innerText = data.Genre
                movieDirector.innerText = data.Director
                movieActor.innerText = data.Actors
                moviePlot.innerText = data.Plot
            } else {
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