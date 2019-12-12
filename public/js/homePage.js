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
      console.log('movie name', movieName);

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
          const thBlank = $('<th>', {
            html: '<i class="fas fa-cart-plus"></i>',
            scope: 'col',
            appendTo: tr
          });

          const tbody = $('<tbody>', {
            mouseenter: function () {
              $(this).css('background-color', 'lightgray');
            },
            mouseleave: function () {
              $(this).css('background-color', 'white');
            },
            appendTo: table
          });
          const trBody = $('<tr>', {
            class: 'table-row-movie-search',
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
          const tdBtn = $('<td>', {
            style: 'cursor: pointer;',
            html: '<i class="fas fa-plus"></i>',
            appendTo: trBody
          });

          const closeBtn = '<button type="button" class="btn btn-primary ff" data-dismiss="modal">Close</button>';

          $('#movie-search-modal').empty();

          $('#movie-search-modal').append(table);

        }

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
        
      if(comment.length < 15)
        return reviewValidation('Comment', 15, true);

      if(stars < 1)
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
        alert(`Review for ${userName} posted successfully!!!`);
      }
    } catch (ex) {
      console.log('ex', ex);
      const comment = ex.responseText;
      console.log(comment);
      alert(`${Comment}`);
    }

  });
  
  //reuseable review validation functions
  function reviewValidation(args, length, bool) {
    const html = `<b>${args} must be at least ${length} Characters in length</b>`;
    const starHtml = `<b>Must leave at least a ${length} star review`;
    $('.review-validation').show().html(bool ? html : starHtml);
    $(`#${args}`).css('border', '1px solid red');
    setTimeout(function () {
      const style = 
      $(`#${args}`).css('border', function() {
        return bool ? '1px solid #ced4da' : 'none';
      });
      $('.review-validation').hide().empty();
    }, 4000);
    return;
  }

});
