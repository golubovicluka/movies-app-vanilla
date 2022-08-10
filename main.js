/* eslint-disable no-unused-vars */
const recommendedCatalog = document.getElementById('recommended-catalog')
const movieCatalog = document.getElementById('movie-catalog')
const genresMenu = document.getElementById('genres-menu')
const search = document.getElementById("search")
const movieJsonData = "data.json"
const watchList = []

class Fetch {
    async fetchData(url) {
        const res = await fetch(url)
        return await res.json()
    }
}
const fetcher = new Fetch();

function toWatchList(movie) {
    if (watchList.length != 7) {
        console.log(`${movie} added to the watch list!`);
        watchList.push(movie)
        console.log(`Current watch list: ${watchList}`);
        const uniqueWatchList = new Set(watchList)
    } else {
        console.log(`Your watch list is full for this week`);
        console.log(watchList)
    }
}

class Render {

    buildRecommendedCatalog(movies) {
        let html = ""
        for (const movie of movies) {
            html += /*html*/ `<div class="movie-card">
                                <div class="card-poster">
                                    <img src="${movie.posterurl}"
                                    alt="${movie.title}">
                                </div>
                                <div class="card-footer">
                                    <span>${movie.title}</span>
                                    <span>${'Year: '}${movie.year}</span>
                                    <span>${'Rating: '}${(movie.ratings.reduce((acc, c, _, arr) => acc + c / arr.length, 0).toFixed(1))}</span>
                                    <button onclick="toWatchList('${movie.title}')">Add to watchlist</button>
                                    </div>
                                </div>`
        }
        recommendedCatalog.innerHTML = html
    }

    buildMovieGenresMenu(categories) {
        let html = ""
        for (const category of categories) {
            html +=/*html*/`<li onclick="moviesFilter.filterByGenre('${category}')">${category}</li>`
        }
        genresMenu.innerHTML = html
    }

    buildMovieCatalog(movies) {
        let html = ""
        for (const movie of movies) {
            html += /*html*/ `<div class="movie-card">
                                <div class="card-poster">
                                    <img src="${movie.posterurl}"
                                    alt="${movie.title}">
                                </div>
                                <div class="card-footer">
                                    <span>${movie.title}</span>
                                    <span>${'Year: '}${movie.year}</span>
                                    <span>${'Rating: '}${(movie.ratings.reduce((acc, c, _, arr) => acc + c / arr.length, 0).toFixed(1))}</span>
                                    <button onclick="toWatchList('${movie.title}')">Add to watchlist</button>
                                    </div>
                                </div>`
        }
        movieCatalog.innerHTML = html
    }
}
const render = new Render();

class MoviesFilter {
    constructor(movies) {
        this.movies = movies;
    }

    filterByGenre(genre) {
        console.log(genre);
        const filteredMovies = this.movies.filter(movie => movie.genres.includes(genre))
        console.log(filteredMovies);
        render.buildMovieCatalog(filteredMovies)
    }

    searchByTitle(title) {
        const filteredMovies = this.movies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()))
        console.log(filteredMovies);
        render.buildMovieCatalog(filteredMovies)
    }

    filterRecommendedMovies(rating) {
        const filteredMovies = this.movies.filter(movie => movie.ratings.reduce((acc, c, _, arr) => acc + c / arr.length, 0).toFixed(1) >= rating)
        render.buildRecommendedCatalog(filteredMovies)
        // console.log(rating, filteredMovies);
    }
}

let moviesFilter;

window.onload = async () => {
    const movies = await fetcher.fetchData(movieJsonData);
    moviesFilter = new MoviesFilter(movies);
    moviesFilter.filterRecommendedMovies(6)
    render.buildMovieCatalog(movies)
    const categories = new Set([].concat.apply([], movies.map(movie => movie.genres)))
    render.buildMovieGenresMenu(categories)
    console.log(categories);
}

// TODO - modify the function to export in days + watchlist combined
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


// console.log(`Final watchlist before CSV ${watchList}`);
// exportToCsv('watchlast.data.csv', [
//     ['name', 'description'],
//     ['david', '123'],
//     ['jona', '""'],
//     ['a', 'b'],
// ])