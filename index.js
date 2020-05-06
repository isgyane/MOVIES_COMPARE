async function fetchData(searchTerm) {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'acd9d2bc',
			s: searchTerm,
			// i: 'tt0848228'
		}
	});

	if (response.data.Error) {
		return []
	}

	return response.data.Search;
}

//everything within our dropdown search results (ROOT)
const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for a Movie</b></label>
<input class="input"/>
<div class="dropdown">
	<div class="dropdown-menu"> 
		<div class="dropdown-content results"></div>
	</div>
</div>
`;


const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async event => {
	//we get our movies list from here
	const moviesList = await fetchData(event.target.value.trim());

	//If there are no movies, we need to close the dropdown
	if (!moviesList.length) {
		dropdown.classList.remove('is-active');

		//The return statement prevents the rest of the code from running
		return;
	}

	// Clear out results before the next search
	resultsWrapper.innerHTML = '';

	dropdown.classList.add('is-active');
	for (let movie of moviesList) {
		const option = document.createElement('a');
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

		option.classList.add('dropdown-item');

		//Creating the innerHTML for each HTML
		option.innerHTML = `
				<img src="${imgSrc}"/>
				${movie.Title}
			`;

		option.addEventListener('click', (event) => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;

			onMovieSelect(movie);
		});

		resultsWrapper.appendChild(option)
	}
};

input.addEventListener('input', debounce(onInput, 500));

//Clearing the dropdown if anywhere else is clicked. So we say if the event target is not one of the elements in the root, we should do something
document.addEventListener('click', event => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});


//Function for the second request when a particular movie is selected
const onMovieSelect = async movie => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'acd9d2bc',
			i: movie.imdbID
		}
	});

	document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}

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
}