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
      console.log("Fatal Error::", ex);
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

  //switch to the login screen//
  $(".login").on("click", function () {
    $(".account-register-form").hide();
    $(".account-login-form").show();
    $(this).addClass("active");
    $(".registration").removeClass("active");
  });

  $(".registration").on("click", function () {
    $(".account-register-form").show();
    $(".account-login-form").hide();
    $(this).addClass("active");
    $(".login").removeClass("active");
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
          //GET MOVIE PAGE FILE
          const moviePage = await $.ajax({
            url: "/homepage",
            method: "GET",
            headers: { "x-auth-token": token }
          });
          localStorage.setItem("x-auth-token", token);
          //console.log('result', result);
          //window.location.href = '/homepage'
          $(".login-body").replaceWith(moviePage);
        } catch (ex) {
          console.log(ex, 'ex');
        }
      }
    } catch (ex) {
      //----------------------------------------------------------//
      //HANDLING ERRORS CLIENT SIDE WE GET FROM THE SERVER//
      //---------------------------------------------------------//
      console.log("Fatal Error::", ex.responseText);
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
          }, 4000);
      }
    }
  });
});
