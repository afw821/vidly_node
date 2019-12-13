(function () {
    //go back to the homepage
    $('.go-home').click(function () {
        window.location.href = '/login';
    });

    //post an auth (login for an admin user)
    $('#login-admin').click(async function () {
        try {
            const email = $('#user-email-login-admin').val();
            const password = $('#first-password-login-admin').val();

            const res = await $.ajax({
                url: '/api/auth/admin',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });
            //console.log(token.getResponseHeader("UserName"));
            sessionStorage.setItem('x-auth-token', res.token);
            if (res.token) window.location.href = `/adminHome=${res.username}`

        } catch (ex) {
            switch (ex.responseText) {
                case "Invalid email or password":
                    $('#incorrect-danger').show().text("Invalid email or password");
                    setTimeout(function () {
                        $('#incorrect-danger').hide().text();
                    }, 2000);
                    break;
                case "User is not an Administrator":
                    $('#incorrect-danger').show().text("User is not an Administrator");
                    setTimeout(function () {
                        $('#incorrect-danger').hide().text();
                    }, 2000);
                    break;
            }
        }
    })
})();