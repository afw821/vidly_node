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
    $(this).on("click", function () {
      //text alerting added
      $(this)
        .next()
        .css("opacity", "1.0");
      setTimeout(function () {
        $(".add-to-cart")
          .next()
          .css("opacity", "0.0");
      }, 1000);
      //adding movie to session storage
      const name = $(this).attr("data-movie-name");
      const id = $(this).attr("data-movieId");
      const price = $(this).attr("data-price");
      sessionStorage.setItem(name, id);
      //build out the quick cart grid
      const movieRow = $("<div>", {
        class: "row mb-3 movie-row"
      });
      const col6 = $("<div>", {
        class: "col-6",
        appendTo: movieRow
      });
      const h3 = $("<h3>", {
        class: "card-text",
        text: name,
        appendTo: col6
      });
      const col2 = $("<div>", {
        class: "col-2",
        appendTo: movieRow
      });
      const quantity = $("<h3>", {
        class: "card-text",
        text: "1",
        appendTo: col2
      });
      const col3 = $("<div>", {
        class: "col-3",
        appendTo: movieRow
      });
      const priceQc = $("<h3>", {
        class: "card-text",
        text: price,
        appendTo: col3
      });
      const col1 = $("<div>", {
        class: "col-1",
        appendTo: movieRow
      });
      const button = $("<button>", {
        class: "close",
        type: "button",
        "data-dismiss": "modal",
        "aria-label": "Close",
        "data-movie-name": name,
        appendTo: col1,
        click: function () {
          $(this)
            .parents(".movie-row")
            .remove();
          //also need to remove the item from session storage
          //so it wont appear on checkout page
          sessionStorage.removeItem(name);
        }
      });
      const span = $("<span>", {
        class: "close",
        "aria-hidden": "true",
        html: "&times;",
        appendTo: button
      });
      $(".movie-grid-container").append(movieRow);
    });
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
  //Search Movie Logic
  //--------------------------------------------------------//
  $('#btnSearchMovie').click(async function () {
    try{
      const movieName = $('#txtMovieName').val();
      console.log('movie name', movieName);
  
      const result = await $.ajax({
        url: 'api/movies/search/name',
        method: 'POST',
        data: {
          title: movieName
        }
      });
  
      if (result.result) {
        console.log('res movie', result.movie);
        $('#btnSearchResult').click();
        const resultArray = result.movie;
        for (let i = 0; i < resultArray.length; i++) {
  
          const name = result.movie[i].title;
          const price = result.movie[i].dailyRentalRate;
          const numberInStock = result.movie[i].numberInStock;
          const movieId = result.movie[i]._id;
          const genreName = result.movie[i].genre.name;
          const genreId = result.movie[i].genre._id;
  
          const table = $('<table>', {
            class: "table",
            "data-genre-id": genreId,
            id: movieId,
            "data-movie-id": movieId
          });
          const thead = $('<thead>', {
            class: "thead-dark",
            appendTo: table
          });
          const tr = $('<tr>', {
            appendTo: thead
          });
          const thTitle = $('<th>', {
            scope: "col",
            text: "Title",
            appendTo: tr
          });
          const thPrice = $('<th>', {
            scope: "col",
            text: "Price",
            appendTo: tr
          });
          const thStock = $('<th>', {
            scope: "col",
            text: "# in Stock",
            appendTo: tr
          });
  
          const tbody = $('<tbody>', {
            appendTo: table
          });
          const trBody = $('<tr>', {
            appendTo: tbody
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
          const closeBtn = '<button type="button" class="btn btn-primary ff" data-dismiss="modal">Close</button>';
          const cartButton = '<button type="button" class="btn btn-primary ff add-to-cart" data-dismiss="modal">Add To Cart</button>'
          
          $('#movie-search-modal').empty();
          $('.modal-button-div').empty();

          $('#movie-search-modal').append(table);
          $('.modal-button-div').append(closeBtn, cartButton);
  
        }
  
      }
    }catch(ex) {
      const response = ex.responseText;
      if(response == "The movie with the requested title was not found."){
        $('#btnSearchResult').click();
        const closeBtn = '<button type="button" class="btn btn-primary ff" data-dismiss="modal">Close</button>';
        $('#movie-search-modal').empty();
        $('.modal-button-div').empty();
        $('#movie-search-modal').text("Sorry we don't have that movie in stock");
        $('.modal-button-div').append(closeBtn);
          
      }
    }


  });
});
