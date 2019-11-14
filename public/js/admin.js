(function () {
    //go back to the homepage
    $('.go-home').click(function() {
        window.location.href = '/login';
    });

    //post an auth (login for an admin user)

    $('#login-admin').click(function() {
        const userEmail = $('#user-email-login-admin').val();
        const password = $('#first-password-login-admin').val();
        console.log(`username: ${userEmail} password:${password}`);
    })
})();