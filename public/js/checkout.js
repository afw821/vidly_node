$(document).ready(async function () {
  const token = sessionStorage.getItem("x-auth-token");
  //GET CURRENT LOGGED IN USER
  //---------------------------------------------------------//
  //GET CURRENT USER
  //--------------------------------------------------------//

  const user = await $.ajax({
    url: "/api/users/me",
    method: "GET",
    headers: { "x-auth-token": token }
  });
  console.log('Me User', user);
  if (!user) alert('No user so error');
  var userId = user._id;
  var userName = user.name;
  var userEmail = user.email;
  var isUserAdmin = user.isAdmin;
  ///END REGION GET LOGGED IN USER
  const moviesInDBArray = [];
  const userSelectedMovies = [];
  const priceArray = [];
  //get all movies to push their names into an array to match with items set in session storage

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

    const checkOutBtn = $('<a>', {
      href: '#',
      class: 'btn btn-primary btn-lg mb30',
      id: `checkout-btn-${getMovieForCheckoutId}`,
      'data-movie-id': getMovieForCheckoutId,
      'data-user-id': userId,
      text: 'Checkout',
      appendTo: childDiv
    });

    const span = $('<span>', {
      class: 'plan-price',
      text: `$${getMovieForCheckoutPrice}`,
      appendTo: childDiv
    });
    priceArray.push(getMovieForCheckoutPrice);
    $('.movie-grid-container').append(movieGrid);

    //click event for checking out movies
    $(`#checkout-btn-${getMovieForCheckoutId}`).click(function () {
      console.log('checkout button clicked', this);
    });

  });


});
