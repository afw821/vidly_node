
$(document).ready(async function () {
  const token = sessionStorage.getItem("x-auth-token");
  if (!token) {
    window.location.href = '/login';

    alert('Only logged in users can see this Page!!!');
  }
  //GET CURRENT USER
  const user = await $.ajax({
    url: "/api/users/me",
    method: "GET",
    headers: { "x-auth-token": token }
  });
  if (!user) alert('No user so error');
  var userId = user._id;
  var userName = user.name;
  var userEmail = user.email;
  var isUserAdmin = user.isAdmin;
  var userCartId = user.cartId;
  $(".welcome-label").text(`Welcome ${userName}!`);
  //---------------------------------------------------------//
  //GET ALL MOVIES FROM THE DB AND BUILD OUT THE GRID
  //--------------------------------------------------------//
  const movies = await $.ajax({
    url: "/api/movies",
    method: "GET",
    headers: { "x-auth-token": token, "index": 1 }
  });

  buildMovieGrid(movies.movies, '.movie-container', userCartId, 'home', userId);

  $('.page-link').click(async function () {
    let index = $(this).data('index');
    $('.page-link').removeClass('active');
    $(this).addClass('active');
    const movies = await $.ajax({
      url: "/api/movies",
      method: "GET",
      headers: { "x-auth-token": token, "index": index }
    });
    $('.movie-tbody').empty();

    buildMovieGrid(movies.movies, '.movie-container', userCartId, 'home', userId);
  })

  //---------------------------------------------------------//
  //LOGOUT A USER
  //--------------------------------------------------------//

  $(".logout-user").on("click", function () {
    localStorage.removeItem("x-auth-token");
    sessionStorage.clear();
    window.location.href = "/login";
  });

  $(".check-out-user").on("click", function () {

    window.location.href = "/checkout";
  });
  //---------------------------------------------------------//
  //ADD MOVIES TO CART 
  //--------------------------------------------------------//
  //This logic was recently added to build movie grid
  //---------------------------------------------------------//
  //Launch Cart Modal / Get Cart
  //--------------------------------------------------------//

  $('.cart-items').click(async function () {
    //GET CURRENT USER with updated cart id that's no longer null
    const user = await $.ajax({
      url: "/api/users/me",
      method: "GET",
      headers: { "x-auth-token": token }
    });
    var updatedCartId = user.cartId;

    $('#btnViewCart').click();
    //get cart by cart id
    const result = await $.ajax({
      url: `/api/carts/${updatedCartId}`,
      method: 'GET'
    });

    if (result.result) {
      const moviesArray = result.movies;
      if (result.movies.length == 0) {
        $('.cart-wrapper').empty().html('<b>Your Cart is Empty</b>');
        return;
      }
      $('tbody.cart-tbody').empty();
      buildMovieGrid(moviesArray, '.cart-wrapper', userCartId, 'cart', userId);
    }
  });
  //---------------------------------------------------------//
  //Leave review view and movie view toggle
  //--------------------------------------------------------//
  $('.leave-review').click(function () {
    $('.leave-review-container').addClass('d-flex');
    $('.leave-review-container').removeClass('hide');

    $('.movie-container').removeClass('d-flex');
    $('.movie-container').addClass('hide');

    $('.movies').removeClass('active');
    $(this).addClass('active');
    $('label').removeClass('active');
  });

  $('.movies').click(function () {
    $('.leave-review-container').removeClass('d-flex');
    $('.leave-review-container').addClass('hide');

    $('.movie-container').removeClass('hide');

    $('.leave-review').removeClass('active');
    $(this).addClass('active');
  });

  //---------------------------------------------------------//
  //Search Movie Logic
  //--------------------------------------------------------//
  $('#btnSearchMovie').on('click', async function () {
    try {       
      const movieName = $('#txtMovieName').val();

      const result = await $.ajax({
        url: 'api/movies/search/name',
        method: 'POST',
        data: {
          title: movieName
        }
      });
      if (result.result) {
        $('#btnSearchResult').click();
        const resultArray = result.movie;
        $('tbody.search-tbody').empty();
        buildMovieGrid(resultArray, '#movie-search-modal', null, 'search', userId);
      }
    } catch (ex) {
      const response = ex.responseText;
      if (response == "The movie with the requested title was not found.") {
        $('#btnSearchResult').click();
        const closeBtn = '<button type="button" class="btn btn-primary ff" data-dismiss="modal">Close</button>';
        $('#movie-search-modal').empty();
        $('.modal-button-div').empty();
        $('#movie-search-modal').text("Sorry we don't have that movie in stock");
        $('.modal-button-div').append(closeBtn);

      }
    }
  });
  //---------------------------------------------------------//
  //Post review Logic
  //--------------------------------------------------------//
  //select stars - logic to highlight them on click
  $('span.fa-star').each(function (i, element) {
    $(this).click(function (e) {
      star(e);
    });
  }); //end star on click
  //POST the review on click of submit
  $('#btnReviewSubmit').click(async function () {
    try {
      const comment = $('#Comment').val();
      const subject = $('#Subject').val();
      const stars = $('.checked').length;
      //client side validation
      if (subject.length < 5)
        return validation.reviewValidation('Subject', 5, true);

      if (comment.length < 15)
        return validation.reviewValidation('Comment', 15, true);

      if (stars < 1)
        return validation.reviewValidation('Stars', 1, false);

      const result = await $.ajax({
        url: '/api/reviews',
        method: 'POST',
        data: {
          userId: userId,
          comment: comment,
          subject: subject,
          stars: stars
        }
      });

      if (result.status) {
        $('#Comment').val("");
        $('#Subject').val("");
        $('span.fa-star').removeClass('checked');
        $('#btnReviewPosted').click();
      }
    } catch (ex) { //server side JOI validation
      const status = ex.status;
      if (status !== 400) {
        alert(`${status} error: Something Broke, please try again later`);
        return;
      }
      const comment = ex.responseText;
      switch (comment) {
        case '"comment" is not allowed to be empty':
          validation.reviewValidation('Comment', 15, true);
          break;
        case '"subject" is not allowed to be empty':
          validation.reviewValidation('Subject', 5, true);
          break;
        case '"stars" must be larger than or equal to 1':
          validation.reviewValidation('Stars', 1, false);
      }
    }
  });
});