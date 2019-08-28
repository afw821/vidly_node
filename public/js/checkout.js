$(document).ready(async function () {
  const moviesInDBArray = [];
  const userSelectedMovies = [];
  const priceArray = [];
  //get all movies to push their names into an array to match with items set in session storage
  const token = sessionStorage.getItem("x-auth-token");
  const movies = await $.ajax({
    url: '/api/movies',
    method: 'GET',
    headers: { "x-auth-token": token }
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
    const genre = getMovieById.genre.name;
    const getMovieForCheckoutId = getMovieById._id;
    const getMovieForCheckoutName = getMovieById.title;
    const getMovieForCheckoutPrice = getMovieById.dailyRentalRate;

    const movieGrid = $('<div>', {
      class: 'plan-selection'
    });

    const childDiv = $('<div>', {
      class: 'plan-data',
      appendTo: movieGrid
    });

    const h2 = $('<h2>', {
      id: 'question2',
      name: 'question',
      class: 'width-font',
      value: 'sel',
      appendTo: childDiv
    });

    const label = $('<label>', {
      for: 'question2',
      text: getMovieForCheckoutName,
      appendTo: childDiv
    });

    const p = $('<p>', {
      class: 'plan-text',
      text: `Genre: ${genre}`,
      appendTo: childDiv
    });

    const span = $('<span>', {
      class: 'plan-price',
      text: `$${getMovieForCheckoutPrice}`,
      appendTo: childDiv
    });
    priceArray.push(getMovieForCheckoutPrice);
    $('.movie-grid-container').append(movieGrid);
  });

  const summaryContainer = $('<div>', {
    class: 'widget',
  });

  const h4 = $('<h4>', {
    class: 'widget-title',
    text: 'Order Summary',
    appendTo: summaryContainer
  });

  const summaryBlock = $('<div>', {
    class: 'summary-block',
    appendTo: summaryContainer
  });

  const summaryContent = $('<div>', {
    class: 'summary-content',
    appendTo: summaryBlock
  });

  const summaryHead = $('<div>', {
    class: 'summary-head',
    appendTo: summaryContent
  });

  const h5 = $('<h5>', {
    class: 'summary-title',
    text: 'Total',
    appendTo: summaryHead
  });

  const summaryPrice = $('<div>', {
    class: 'summary-price',
    appendTo: summaryContent
  });

  const priceP = $('<p>', {
    class: 'summary-text total-amount-summary',
    text: '$258',
    appendTo: summaryPrice
  });
  console.log('price array', priceArray, priceArray.length);
  $('.order-summary-container').html(summaryContainer);
});
