$(document).ready(function () {
    console.log('login js working');
    $('#register').on('click', async function () {
        try {
            const firstPassword = $('#first-password').val().trim();
            const password = $('#user-password').val().trim();
            const email = $('#user-email').val().trim();
            const name = $('#user-name').val().trim();
            const isAdmin = false;
            let doesPasswordMatch = firstPassword === password;

            if (firstPassword.length < 5 || password.length < 5) {
                $('.password-length-validation').css('opacity', '1.0');
                setTimeout(function () { $('.password-length-validation').css('opacity', '0.0'); }, 4000);
                return;
            }
            if (!doesPasswordMatch) {
                $('.password-match-validation').css('opacity', '1.0');
                setTimeout(function () { $('.password-match-validation').css('opacity', '0.0'); }, 4000);
                return;
            }
            const result = await $.ajax({
                url: '/api/users',
                method: 'POST',
                data: {
                    name: name,
                    email: email,
                    password: password,
                    isAdmin: isAdmin
                }
            });
            console.log(result);
            if (result) {
                alert('Account Successfully Created!');
            }
        } catch (ex) {
            console.log('Fatal Error::', ex);
            if (ex.responseText === 'User already registered') {
                $('.email-validation').css('opacity', '1.0');
                setTimeout(function () { $('.email-validation').css('opacity', '0.0'); }, 4000);
                return;
            }
            if (ex.responseText === '"name" length must be at least 5 characters long') {
                $('.name-length-validation').css('opacity', '1.0');
                setTimeout(function () { $('.name-length-validation').css('opacity', '0.0'); }, 4000);
                return;
            }
            if (ex.responseText === '"email" must be a valid email') {

                $('.email-format-validation').css('opacity', '1.0');
                setTimeout(function () { $('.email-format-validation').css('opacity', '0.0'); }, 4000);
                return;
            }
        }
    });

    //switch to the login screen
    $('.login').on('click', function () {
        $('.account-register-form').hide();
        $('.account-login-form').show();
    });

    $('#login-user').on('click', async function () {
        const email = $('#user-email-login').val();
        const password = $('#first-password-login').val();
        try {
            const token = await $.ajax({
                url: '/api/auth',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });

            if (token) {
                localStorage.setItem('token', token)
                window.location.href = `/homepage/${token}`;
            }
        } catch (ex) {
            console.log('Fatal Error::', ex.responseText);
            switch (ex.responseText) {
                case 'invalid email or password':
                    //alert('invalid email or password');
                    $('#invalid-email-password').css('opacity', '1.0');
                    setTimeout(function () { $('#invalid-email-password').css('opacity', '0.0'); }, 4000);
                    break;
                case '"password" length must be at least 5 characters long':
                    //alert('password must be at least 5 characters long');
                    $('#password-length-login').css('opacity', '1.0');
                    setTimeout(function () { $('#password-length-login').css('opacity', '0.0'); }, 4000);
                    break;
                case '"email" must be a valid email':
                    $('#valid-email-login').css('opacity', '1.0');
                    setTimeout(function () { $('#valid-email-login').css('opacity', '0.0'); }, 4000);
            }
        }
    });
});