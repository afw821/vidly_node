(function () {
    //go back to the homepage
    $('.go-home').click(function () {
        window.location.href = '/login';
    });

    $('#login-admin').click(async function () {
        try {
            const email = $('#Email').val();
            const password = $('#Password').val();

            if (password.length < 5)
                return validation.reviewValidation('Password', 5, true);
            if (email.length < 5)
                return validation.reviewValidation('Email', 5, true);

            const res = await $.ajax({
                url: '/api/auth/admin',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });
            sessionStorage.setItem('x-auth-token', res.token);
            if (res.token) window.location.href = `/adminHome=${res.username}`

        } catch (ex) {
            switch (ex.responseText) {
                case "Invalid email or password":
                    validation.authValidation(false, false);
                    break;
                case "User is not an Administrator":
                    validation.notAdmin('Email');
                    break;
            }
        }
    })
})();