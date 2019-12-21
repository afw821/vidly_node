$(document).ready(async function () {
  const token = sessionStorage.getItem("x-auth-token");
  if (!token) {
    window.location.href = '/login';

    alert('Only logged in users can see this Page!!!');
  }
  //---------------------------------------------------------//
  //GET CURRENT USER
  //--------------------------------------------------------//

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
    headers: { "x-auth-token": token }
  });

  $(movies).each(function (i, e) {
    const dailyRentalRate = movies[i].dailyRentalRate;
    const numberInStock = movies[i].numberInStock;
    const movieName = movies[i].title;
    const movieId = movies[i]._id;

    const movieCard = $("<div>", {
      class: "movie-card card mb-4",
      style: "width: 18rem; background-color: lightgray;"
    });
    const movieCardBody = $("<div>", {
      class: "movie-card-body card-body",
      appendTo: movieCard
    });
    const h5 = $("<h5>", {
      class: "movie-card-title card-title",
      text: movieName,
      appendTo: movieCardBody
    });
    const inStock = $("<p>", {
      class: "card-text",
      text: `Only ${numberInStock} Left In Stock!`,
      appendTo: h5
    });
    const price = $("<div>", {
      class: "card-text",
      text: `$${dailyRentalRate} / Day`,
      appendTo: h5
    });
    const button = $("<a>", {
      class: "btn btn-primary add-to-cart",
      id: `${movieId}`,
      "data-user-id": userId,
      "data-movie-name": movieName,
      "data-movieId": movieId,
      "data-price": dailyRentalRate,
      text: "Add To Cart",
      appendTo: h5
    });
    const alertText = $("<small>", {
      id: movieId,
      class: "added-to-cart form-text",
      style: "opacity:0.0; color:green",
      text: "Successfully Added To Cart!!",
      appendTo: h5
    });
    $(".movie-container").append(movieCard);
    //Adding to Card we are setting the item in local staorage to be able to get it on checkout page
    $(`#${movieId}`).on("click", function () {
      const movieid = $(this).attr("data-movieId");
      const userid = $(this).attr("data-user-id");
      localStorage.setItem("Movie", movieid);
      localStorage.setItem("User", userid);
    });
  });

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
  //ADD MOVIES TO CART (SESSION STORAGE)
  //--------------------------------------------------------//
  $(".add-to-cart").each(function (i, e) {
    $(this).on("click", async function () {
      try {
 
        const userId = $(this).attr('data-user-id');
        const movieId = $(this).attr('data-movieid');

        const result = await $.ajax({
          url: '/api/carts',
          method: 'POST',
          data: {
            userId: userId,
            movieId: movieId
          }
        });
       
        if (result.status) {
          $(this)
            .next()
            .css("opacity", "1.0");
          setTimeout(function () {
            $(".add-to-cart")
              .next()
              .css("opacity", "0.0");
          }, 1000);
        }
      } catch (ex) {
        console.log(`Ex posting a cart: ${ex}`);
      }
    });
  });
  //---------------------------------------------------------//
  //Launch Cart Modal / Get Cart
  //--------------------------------------------------------//

  $('.cart-items').click(async function () {
    $('#btnViewCart').click();
    //get cart by cart id
    const result = await $.ajax({
      url: `/api/carts/${userCartId}`,
      method: 'GET'
    });

    if(result.result){
      const moviesArray = result.movies;
      if(result.movies.length == 0){
        $('.cart-wrapper').empty().html('<b>Your Cart is Empty</b>');
        return;
      }
      $('tbody').empty();
      buildMovieGrid(moviesArray, '.cart-wrapper');
    }
  });
  //---------------------------------------------------------//
  //Quick View Cart Toggle
  //--------------------------------------------------------//
  $(".cart-items").on("mouseenter", function () {
    $(".quick-view-cart").removeClass("hide");
    $(".quick-view-cart").slideDown();
  });
  $(".quick-cart-close").on("click", function () {
    $(".quick-view-cart").slideUp();
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
  });

  $('.movies').click(function () {
    $('.leave-review-container').removeClass('d-flex');
    $('.leave-review-container').addClass('hide');

    $('.movie-container').addClass('d-flex');
    $('.movie-container').removeClass('hide');

    $('.leave-review').removeClass('active');
    $(this).addClass('active');
  });

  //---------------------------------------------------------//
  //Search Movie Logic
  //--------------------------------------------------------//
  $('#btnSearchMovie').click(async function () {
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
        $('tbody').empty();
        buildMovieGrid(resultArray, '#movie-search-modal');
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
      //clear all if ANY of the stars are checked AND the one you click is checked ***AND*** there are no more checked after the one clicked
      //This clears them if you click on a yellow star//****** */
      const starClicked = parseInt(e.target.id);
      if ($('span.fa-star').hasClass('checked') && (e.target.classList[3]) && !(e.currentTarget.nextElementSibling.classList[3])) {
        //remove all of them
        $('span.fa-star').removeClass('checked');
        return;
      }
      //if ANY of the stars are checked AND the one you click is checked ***AND*** there ARE more checked after the one clicked ONLY clear the ones after the one clicked
      if ($('span.fa-star').hasClass('checked') && (e.target.classList[3])) {
        switch (starClicked) {
          case 1:
            $('#2').removeClass('checked');
            $('#3').removeClass('checked');
            $('#4').removeClass('checked');
            $('#5').removeClass('checked');
            break;
          case 2:
            $('#3').removeClass('checked');
            $('#4').removeClass('checked');
            $('#5').removeClass('checked');
            break;
          case 3:
            $('#4').removeClass('checked');
            $('#5').removeClass('checked');
            break;
          case 4:
            $('#5').removeClass('checked');
            break;
        }
        return;
      }
      //if no stars are checked we add yellow to all the ones behind the one and including the one clicked
      if (!$('span.fa-star').hasClass('checked')) {
        switch (starClicked) {
          case 1:
            $('#1').addClass('checked');
            break;
          case 2:
            $('#1').addClass('checked');
            $('#2').addClass('checked');
            break;
          case 3:
            $('#1').addClass('checked');
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            break;
          case 4:
            $('#1').addClass('checked');
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            $('#4').addClass('checked');
            break;
          case 5:
            $('#1').addClass('checked');
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            $('#4').addClass('checked');
            $('#5').addClass('checked');
            break;
        }
        return;
      } else if ($('span.fa-star').hasClass('checked') && (e.currentTarget.previousElementSibling.classList[3])) { //else we are adding stars when there are already stars behind one clicked . any stars checked 2. there are stars behind the one checked
        switch (starClicked) {
          case 2:
            $('#2').addClass('checked');
            break;
          case 3:
            $('#3').addClass('checked');
            break;
          case 4:
            $('#4').addClass('checked');
            break;
          case 5:
            $('#5').addClass('checked');
            break;
        }
        return;
      } else {
        switch (starClicked) {
          case 3:
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            break;
          case 4:
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            $('#4').addClass('checked');
            break;
          case 5:
            $('#2').addClass('checked');
            $('#3').addClass('checked');
            $('#4').addClass('checked');
            $('#5').addClass('checked');
            break;
        }
        return;
      }
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
        return reviewValidation('Subject', 5, true);

      if (comment.length < 15)
        return reviewValidation('Comment', 15, true);

      if (stars < 1)
        return reviewValidation('Stars', 1, false);

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
      console.log('result', result);

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
          reviewValidation('Comment', 15, true);
          break;
        case '"subject" is not allowed to be empty':
          reviewValidation('Subject', 5, true);
          break;
        case '"stars" must be larger than or equal to 1':
          reviewValidation('Stars', 1, false);
      }

    }

  });

  //reuseable review validation functions
  function reviewValidation(args, length, bool) {
    const html = `<b>${args} must be at least ${length} Characters in length</b>`;
    const starHtml = `<b>Must leave at least a ${length} star review`;
    $('.review-validation').show().html(bool ? html : starHtml);
    $(`#${args}`).css('border', '1px solid red');
    setTimeout(function () {
      $(`#${args}`).css('border', function () {
        return bool ? '1px solid #ced4da' : 'none';
      });
      $('.review-validation').hide().empty();
    }, 4000);
    return;
  }

  function buildMovieGrid (array, container) {
    for (let i = 0; i < array.length; i++) {
      const name = array[i].title;
      const price = array[i].dailyRentalRate;
      const numberInStock = array[i].numberInStock;
      const movieId = array[i]._id;
      const genreName = array[i].genre.name;
      const genreId = array[i].genre._id;

      const trBody = $('<tr>', {
        class: 'table-row-cart',
        mouseenter: function (){
          this.style.background = 'lightgray';
        },
        mouseleave: function () {
          this.style.background = 'white';
        }
      });
      const tdTitle = $('<td>', {
        text: name,
        id: movieId,
        "data-genre-id": genreId,
        "data-movie-id": movieId,
        appendTo: trBody
      });
      const tdPrice = $('<td>', {
        text: `$${price} / Day`,
        id: movieId,
        "data-genre-id": genreId,
        "data-movie-id": movieId,
        appendTo: trBody
      });
      const tdStock = $('<td>', {
        text: numberInStock,
        id: movieId,
        "data-genre-id": genreId,
        "data-movie-id": movieId,
        appendTo: trBody
      });
      const tdBtn = $('<td>', {
        style: 'cursor: pointer;',
        html: '<i class="fas fa-plus"></i>',
        appendTo: trBody
      });
      $(container).find('tbody').append(trBody);

    }
  }

});
