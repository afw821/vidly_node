$(document).ready(async function () {
  const token = localStorage.getItem("x-auth-token");

  //---------------------------------------------------------//
  //GET CURRENT USER
  //--------------------------------------------------------//

  const user = await $.ajax({
    url: "/api/users/me",
    method: "GET",
    headers: { "x-auth-token": token }
  });

  var userId = user._id;
  var userName = user.name;
  var userEmail = user.email;
  var isUserAdmin = user.isAdmin;
  $(".welcome-label").text(`Welcome ${userName}!`);
  //---------------------------------------------------------//
  //GET ALL MOVIES FROM THE DB AND BUILD OUT THE GRID
  //--------------------------------------------------------//
  const movies = await $.ajax({
    url: "/api/movies",
    method: "GET"
  });
  $(movies).each(function (i, e) {
    const dailyRentalRate = movies[i].dailyRentalRate;
    const numberInStock = movies[i].numberInStock;
    const movieName = movies[i].title;
    const movieId = movies[i]._id;

    const movieCard = $("<div>", {
      class: "movie-card card mb-4",
      style: "width: 18rem;"
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
    const alertText = $('<small>', {
      id: movieId,
      class: 'added-to-cart form-text',
      style: 'opacity:0.0; color:green',
      text: 'Successfully Added To Cart!!',
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
  $('.add-to-cart').each(function (i, e) {
    $(this).on('click', function () {
      //text alerting added
      $(this).next().css('opacity', '1.0');
      setTimeout(function () { $('.add-to-cart').next().css('opacity', '0.0') }, 1000);
      //adding movie to session storage
      const name = $(this).attr('data-movie-name');
      const id = $(this).attr('data-movieId');
      const price = $(this).attr('data-price');
      sessionStorage.setItem(name, id);
      //create quick cart grid on click and append it
      const quickCartGrid = `<div class="row mb-3">
      <div class="col-4">
          <h3 class="card-text">${name}</h3>
      </div>
      <div class="col-4">
          <h3 class="card-text">1</h3>
      </div>
      <div class="col-4">
          <h3 class="card-text">$${price}</h3>
      </div>

  </div>`
      $('.movie-grid-container').append(quickCartGrid);
    });
  });
  //---------------------------------------------------------//
  //Quick View Cart
  //--------------------------------------------------------//
  $('.cart-items').on('mouseenter', function () {

    $('.quick-view-cart').removeClass('hide');
  });
  $('.cart-items').on('mouseleave', function () {

    $('.quick-view-cart').addClass('hide');
  });

});
