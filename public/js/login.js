$(document).ready(function () {

  //------------------------------//
  //REGISTERING A USER//
  //------------------------------//
  $("#register").on("click", async function () {
    try {
      const firstPassword = $("#first-password")
        .val()
        .trim();
      const password = $("#user-password")
        .val()
        .trim();
      const email = $("#user-email")
        .val()
        .trim();
      const name = $("#user-name")
        .val()
        .trim();
      const isAdmin = false;
      let doesPasswordMatch = firstPassword === password;
      //-----------------------------------//
      //VALIDATING A USER INPUT//
      //----------------------------------//
      if (firstPassword.length < 5 || password.length < 5) {
        $(".password-length-validation").css("opacity", "1.0");
        setTimeout(function () {
          $(".password-length-validation").css("opacity", "0.0");
        }, 4000);
        return;
      }
      if (!doesPasswordMatch) {
        $(".password-match-validation").css("opacity", "1.0");
        setTimeout(function () {
          $(".password-match-validation").css("opacity", "0.0");
        }, 4000);
        return;
      }
      //POSTING A NEW USER//
      const result = await $.ajax({
        url: "/api/users",
        method: "POST",
        data: {
          name: name,
          email: email,
          password: password,
          isAdmin: isAdmin
        }
      });
      //ALERT IF ACCOUNT IS SUCESSFULLY CREATED//
      if (result) {
        //Launch modal if account successfully created
        $('#btnAcct').click();
      }
    } catch (ex) {
      //--------------------------------------------------//
      //HANDLING ERRORS WE RECEIVE FROM THE SERVER//
      //--------------------------------------------------//
      if (ex.responseText === "User already registered") {
        $(".email-validation").css("opacity", "1.0");
        setTimeout(function () {
          $(".email-validation").css("opacity", "0.0");
        }, 4000);
        return;
      }
      if (
        ex.responseText === '"name" length must be at least 5 characters long'
      ) {
        $(".name-length-validation").css("opacity", "1.0");
        setTimeout(function () {
          $(".name-length-validation").css("opacity", "0.0");
        }, 4000);
        return;
      }
      if (ex.responseText === '"email" must be a valid email') {
        $(".email-format-validation").css("opacity", "1.0");
        setTimeout(function () {
          $(".email-format-validation").css("opacity", "0.0");
        }, 4000);
        return;
      }
    }
  });

  //switch to the login screen// AND to Customer Reviews
  $(".login").on("click", function () {
    $(".account-register-form").hide();
    $(".account-login-form").show();
    $('.customer-review-div').hide();
    $(this).addClass("active");
    $(".registration").removeClass("active");
    $('.customer-reviews').removeClass("active");
  });
  
  $(".registration").on("click", function () {
    $(".account-register-form").show();
    $(".account-login-form").hide();
    $('.customer-review-div').hide();
    $(this).addClass("active");
    $(".login").removeClass("active");
    $('.customer-reviews').removeClass("active");
  });
  $('.customer-reviews').click(function () {
    $(".account-register-form").hide();
    $(".account-login-form").hide();
    $('.customer-review-div').show();
    $(".login").removeClass("active");
    $(this).addClass("active");
    $(".registration").removeClass("active");
  });
  //go to admim portal
  $('.admin').click(function () {
    window.location.href = '/admin';
  });
  //-----------------------------------------//
  //ON CLICK FOR USER TO LOGIN//
  //-----------------------------------------//
  $("#login-user").on("click", async function () {
    const email = $("#user-email-login").val();
    const password = $("#first-password-login").val();
    try {
      //POST TO AUTH TO AUTHENTICATE THE USER
      const token = await $.ajax({
        url: "/api/auth",
        method: "POST",
        data: {
          email: email,
          password: password
        }
      });
      //IF VALID USER (THEY HAVE A VALID JWT)
      if (token) {
        try {

          sessionStorage.setItem("x-auth-token", token);
          window.location.href = '/homepage';

        } catch (ex) {
          console.log(ex, 'ex');
        }
      }
    } catch (ex) {
      //----------------------------------------------------------//
      //HANDLING ERRORS CLIENT SIDE WE GET FROM THE SERVER//
      //---------------------------------------------------------//
      switch (ex.responseText) {
        case "invalid email or password":
          $("#invalid-email-password").css("opacity", "1.0");
          setTimeout(function () {
            $("#invalid-email-password").css("opacity", "0.0");
          }, 4000);
          break;
        case '"password" length must be at least 5 characters long':
          $("#password-length-login").css("opacity", "1.0");
          setTimeout(function () {
            $("#password-length-login").css("opacity", "0.0");
          }, 4000);
          break;
        case '"email" must be a valid email':
          $("#valid-email-login").css("opacity", "1.0");
          setTimeout(function () {
            $("#valid-email-login").css("opacity", "0.0");
            $('#user-email').css('background-color', 'red');
          }, 4000);
      }
    }
  });

  //-----------------------------------------//
  //GETTING AND DISPLAYING REVIEWS//
  //-----------------------------------------//
  (async function() {
    try{
      const reviews = await $.ajax({
        url: 'api/reviews/',
        method: 'GET'
      });

      for(let i = 0; i < reviews.length; i++) {

        const comment = reviews[i].comment;
        const date = reviews[i].date;
        const subject = reviews[i].subject;
        const stars = reviews[i].stars;
        const userId = reviews[i].user._id;
        const userEmail = reviews[i].user.email;
        const userName = reviews[i].user.name;
        
        const reviewWrapper = $('<div>', {
          class: "card text-center review-wrapper-div mb-4",
          id: userId
        });
        const reviewHeader = $('<div>', {
          class: "review-header card-header",
          text: `By: ${userName}  ${date}`,
          appendTo: reviewWrapper
        });
        const reviewBody = $('<div>', {
          class: "card-body review-body",
          appendTo: reviewWrapper
        });
        const reviewSubject = $('<h5>', {
          class: "card-title review-subject",
          text: subject,
          appendTo: reviewBody
        });
        const reviewComment = $('<p>', {
          class: "card-text review-comment",
          text: comment,
          appendTo: reviewBody
        });
        const reviewStarsDiv = $('<div>', {
          class: "card-footer text-muted review-stars-div",
          appendTo: reviewWrapper
        });
        const oneStar = $('<span>', {
          class: function () {
            if(stars >= 1) return 'fa fa-star one-star checked';

            return 'fa fa-star one-star';
          },
          appendTo: reviewStarsDiv
        });
        const twoStar = $('<span>', {
          class: function () {
            if(stars >= 2) return 'fa fa-star two-star checked';

            return 'fa fa-star two-star';
          },
          appendTo: reviewStarsDiv
        });
        const threeStar = $('<span>', {
          class: function () {
            if(stars >= 3) return 'fa fa-star three-star checked';

            return 'fa fa-star three-star';
          },
          appendTo: reviewStarsDiv
        });
        const fourStar = $('<span>', {
          class: function () {
            if(stars >= 4) return 'fa fa-star four-star checked';

            return 'fa fa-star four-star';
          },
          appendTo: reviewStarsDiv
        });
        const fiveStar = $('<span>', {
          class: function () {
            if(stars == 5) return 'fa fa-star five-star checked';

            return 'fa fa-star five-star';
          },
          appendTo: reviewStarsDiv
        });

        $('.customer-review-div').append(reviewWrapper);
      }
    }catch(ex) {
      alert('There was an error!!');
    }
  })();
});
