/* eslint-disable no-unused-vars */
const recommendedCatalog = document.getElementById("recommended-catalog");
const movieCatalog = document.getElementById("movie-catalog");
const genresMenu = document.getElementById("genres-menu");
const search = document.getElementById("search");
const moviesWatchList = document.getElementById("watch-list");
const injectButton = document.getElementById("csv");
const movieJsonData = "data.json";
let movies = [];
const watchList = [];

class Fetch {
  async fetchData(url) {
    const res = await fetch(url);
    return await res.json();
  }
}
const fetcher = new Fetch();

class Render {
  buildMoviesWatchList(movies) {
    let html = "";
    const days = [
      "",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let i = 0;
    for (const movie of movies) {
      i++;
      html += /*html*/ `<div>
                                <div class="watch-list-container">
                                    <li>
                                    ${days[i]}: ${movie}
                                    </li>
                            </div>`;
    }
    moviesWatchList.innerHTML = html;
  }

  buildRecommendedCatalog(movies) {
    let html = "";
    for (const movie of movies) {
      const inWatchList = watchList.includes(movie.title);
      html += /*html*/ `<div class="movie-card">
                                <div class="card-poster">
                                    <img src="${movie.posterurl}"
                                    alt="${movie.title}">
                                </div>
                                <div class="card-footer">
                                    <span>${movie.title}</span>
                                    <span>${"Year: "}${movie.year}</span>
                                    <span>${"Rating: "}${movie.ratings
        .reduce((acc, c, _, arr) => acc + c / arr.length, 0)
        .toFixed(1)}</span>
                                    <button onclick="toWatchList('${
                                      movie.title
                                    }')">${
        inWatchList ? "In watch list" : "Add to watchlist"
      }</button>
                                    </div>
                                </div>`;
    }
    recommendedCatalog.innerHTML = html;
  }

  buildMovieGenresMenu(categories) {
    let html = "";
    for (const category of categories) {
      html += /*html*/ `<li onclick="moviesFilter.filterByGenre('${category}')">${category}</li>`;
    }
    genresMenu.innerHTML = html;
  }

  buildMovieCatalog(movies) {
    let html = "";
    for (const movie of movies) {
      const inWatchList = watchList.includes(movie.title);
      html += /*html*/ `<div class="movie-card">
                                <div class="card-poster">
                                    <img src="${movie.posterurl}"
                                    alt="${movie.title}">
                                </div>
                                <div class="card-footer">
                                    <span>${movie.title}</span>
                                    <span>${"Year: "}${movie.year}</span>
                                    <span>${"Rating: "}${movie.ratings
        .reduce((acc, c, _, arr) => acc + c / arr.length, 0)
        .toFixed(1)}</span>
                                    <button onclick="toWatchList('${
                                      movie.title
                                    }')">${
        inWatchList ? "In watch list" : "Add to watchlist"
      }</button>
                                    </div>
                                </div>`;
    }
    movieCatalog.innerHTML = html;
  }
}
const render = new Render();

class MoviesFilter {
  constructor(movies) {
    this.movies = movies;
  }

  filterByGenre(genre) {
    console.log(genre);
    const filteredMovies = this.movies.filter((movie) =>
      movie.genres.includes(genre)
    );
    console.log(filteredMovies);
    render.buildMovieCatalog(filteredMovies);
  }

  searchByTitle(title) {
    const filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(title.toLowerCase())
    );
    console.log(filteredMovies);
    render.buildMovieCatalog(filteredMovies);
  }

  filterRecommendedMovies(rating) {
    const filteredMovies = this.movies.filter(
      (movie) =>
        movie.ratings
          .reduce((acc, c, _, arr) => acc + c / arr.length, 0)
          .toFixed(1) >= rating
    );
    render.buildRecommendedCatalog(filteredMovies);
  }
}

let moviesFilter;

window.onload = async () => {
  const fetchedMovies = await fetcher.fetchData(movieJsonData);
  movies = fetchedMovies;
  moviesFilter = new MoviesFilter(movies);
  moviesFilter.filterRecommendedMovies(6);
  render.buildMovieCatalog(movies);
  const categories = new Set(
    [].concat.apply(
      [],
      movies.map((movie) => movie.genres)
    )
  );
  render.buildMovieGenresMenu(categories);
};

function toWatchList(movie) {
  if (watchList.length <= 6) {
    console.log(`${movie} added to the watch list!`);
    watchList.push(movie);
    const uniqueWatchList = new Set(watchList);
    render.buildMoviesWatchList(watchList);
    moviesFilter.filterRecommendedMovies(6);
    render.buildMovieCatalog(movies);
  } else {
    exportToCsv("watchlist.data.csv", [
      ["Day", "Movie title"],
      ["Monday", `${watchList[0]}`],
      ["Tuesday", `${watchList[1]}`],
      ["Wednesay", `${watchList[2]}`],
      ["Thursday", `${watchList[3]}`],
      ["Friday", `${watchList[4]}`],
      ["Saturday", `${watchList[5]}`],
      ["Sunday", `${watchList[6]}`],
    ]);
    alert(
      "Hey...Enough for this week, save some time for coding...downloading automatically, here are your movies data for this week, enjoy!"
    );
  }
}

// Helper function to export CSV
function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = "";
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? "" : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }
    return finalVal + "\n";
  };

  var csvFile = "";
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
