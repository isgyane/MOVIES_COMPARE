//Here, we call the autocomplete function and pass movie (or any
// other) information as arguments

const autoCompleteConfig = {
  //RenderOption shows how to render an individual item
  renderOption(movie) {
    //renderOption shows the options in the dropdown
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
	`;
  },

  //InputValue shows what to back-fill into the search field when the user clicks on an option
  inputValue(movie) {
    return movie.Title;
  },

  //FetchData is how the data is fetched from the API
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "acd9d2bc",
        s: searchTerm,
        // i: 'tt0848228'
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

//Left autocomplete widget
createAutocomplete({
  //Making use of SPREAD to add one Object to another
  ...autoCompleteConfig,

  //Root shows where to render the autocomplete to
  root: document.querySelector("#left-autocomplete"),

  //OnOptionSelect indicates what should be done when a user clicks on an option
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"));
  },
});

//Right autocomplete widget
createAutocomplete({
  //Making use of SPREAD to add one Object to another
  ...autoCompleteConfig,

  //Root shows where to render the autocomplete to
  root: document.querySelector("#right-autocomplete"),

  //OnOptionSelect indicates what should be done when a user clicks on an option
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"));
  },
});

//Function for the second request when a particular movie is selected
const onMovieSelect = async (movie, summaryElement) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "acd9d2bc",
      i: movie.imdbID,
    },
  });

  //Summary element indicates the target element for rendering a specific after it's selected
  summaryElement.innerHTML = movieTemplate(response.data);
};

//After selecting the movie, we should do the following (display from the response object the various values we want to display on the page)
const movieTemplate = (movieDetail) => {
  return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}"/>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		  </article>
		  <article class="notification is-primary">
			 <p class="title">${movieDetail.Awards}</p> 
			 <p class="sub-title">Awards</p>
		  </article>
		  <article class="notification is-primary">
			 <p class="title">${movieDetail.BoxOffice}</p> 
			 <p class="sub-title">Box Office</p>
		  </article>
		  <article class="notification is-primary">
			 <p class="title">${movieDetail.Metascore}</p> 
			 <p class="sub-title">Metascore</p>
		  </article>
		  <article class="notification is-primary">
			 <p class="title">${movieDetail.imdbRating}</p> 
			 <p class="sub-title">IMDB Rating</p>
		  </article>
		  <article class="notification is-primary">
			 <p class="title">${movieDetail.imdbVotes}</p> 
			 <p class="sub-title">IMDB Votes</p>
		  </article>
	`;
};
