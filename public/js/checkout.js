$(document).ready(async function () {
  const moviesInDBArray = [];
  const userSelectedMovies = [];
  const movieObject = [];
  //get all movies to push their names into an array to match with items set in session storage
  const movies = await $.ajax({
    url: '/api/movies',
    method: 'GET'
  });
  //loop through all Movies and push into array
  $(movies).each(function (i, e) {
    const movieName = movies[i].title;
    moviesInDBArray.push(movieName);

  });
  //compare movies in Data Base with all movies 
  moviesInDBArray.forEach(function (movieName) {
    //console.log('movieName', movieName);
    for (let i = 0; i < sessionStorage.length; i++) {
      const selectedMoviesName = sessionStorage.key(i);
      //console.log('selected Movies name', selectedMoviesName);
      if (movieName === selectedMoviesName) {
        //console.log('selected movies name iffff', selectedMoviesName);
        userSelectedMovies.push(selectedMoviesName);
      }
    }

  });

  //console.log('theses are the movies the user has selected to checkout', userSelectedMovies);
  userSelectedMovies.forEach(async function (movie) {
    const movieIdForCheckout = sessionStorage.getItem(movie);

    //console.log(movieIdForCheckout);
    movieIdForCheckout.toString();

    const getMovieById = await $.ajax({
      url: `/api/movies/${movieIdForCheckout}`,
      method: 'GET'
    });
    //console.log('Movie Object', getMovieById);
    const getMovieForCheckoutId = getMovieById._id;
    const getMovieForCheckoutName = getMovieById.title;
    const getMovieForCheckoutPrice = getMovieById.dailyRentalRate;
    // console.log('id', getMovieForCheckoutId);
    // console.log('name', getMovieForCheckoutName);
    // console.log('price', getMovieForCheckoutPrice);


    const movieGrid = `<div class="plan-selection">
        <div class="plan-data">
            <input id="question1" name="question" type="radio" class="with-font" value="sel" />
            <label>${getMovieForCheckoutName}</label>
            <p class="plan-text">
                Genre: Action</p>
            <span class="plan-price">${getMovieForCheckoutPrice}</span>
        </div>
    </div>`
    $('.movie-grid-container').append(movieGrid);
  });











});
