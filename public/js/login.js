
$(document).ready(function () {
  //------------------------------//
  //REGISTERING A USER//
  //------------------------------//
  $("#register").click(async function () {
    try {
      const firstPassword = $("#First-Password").val().trim();
      const password = $("#User-Password").val().trim();
      const email = $("#User-Email").val().trim();
      const name = $("#User-Name").val().trim();
      let doesPasswordMatch = firstPassword === password;
      //-----------------------------------//
      //VALIDATING A USER INPUT//
      //----------------------------------//
      if (firstPassword.length < 5)
        return validation.reviewValidation('First-Password', 5, true);
      if (password.length < 5)
        return validation.reviewValidation('User-Password', 5, true);
      if (!doesPasswordMatch)
        return validation.match('First-Password', 'User-Password', true);
      if (email.length < 5)
        return validation.reviewValidation('User-Email', 5, true);
      if (name.length < 5)
        return validation.reviewValidation('User-Name', 5, true);
      //POSTING A NEW USER//
      const result = await $.ajax({
        url: "/api/users",
        method: "POST",
        data: {
          name: name,
          email: email,
          password: password,
        }
      });
      //ALERT IF ACCOUNT IS SUCESSFULLY CREATED//
      if (result) {
        $('#btnAcct').click();
      }
    } catch (ex) {
      switch (ex.responseText) {
        case "User already registered":
          validation.match('User-Email', null, false);
          break;
        case '"name" length must be at least 5 characters long':
          validation.reviewValidation('User-Name', 5, true);
          break;
        case '"email" must be a valid email':
          validation.authValidation('User-Email', true);
          break;
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
    const email = $("#Email").val();
    const password = $("#Password").val();
    try {
      if (password.length < 5)
        return validation.reviewValidation('Password', 5, true);
      if (email.length < 5)
        return validation.reviewValidation('Email', 5, true);

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
        sessionStorage.setItem("x-auth-token", token);
        window.location.href = '/homepage';
      }
    } catch (ex) {
      switch (ex.responseText) {
        case "invalid email or password":
          validation.authValidation(false, false);
          break;
        case '"email" must be a valid email':
          validation.authValidation('Email', true);
      }
    }
  });
  //-----------------------------------------//
  //GETTING AND DISPLAYING REVIEWS//
  //-----------------------------------------//
  (async function () {
    try {
      const reviews = await $.ajax({
        url: 'api/reviews/',
        method: 'GET'
      });
      buildReviews(reviews, '.customer-review-div');
    } catch (ex) {
      alert('There was an error!!');
    }
  })();
});