(function () {
    //go back to the homepage
    $('.go-home').click(function() {
        window.location.href = '/login';
    });

    //post an auth (login for an admin user)
    console.log('hello world!');
    $('#login-admin').click(async function() {
        try{
            const email = $('#user-email-login-admin').val();
            const password = $('#first-password-login-admin').val();
            console.log(`username: ${email} password:${password}`);

            const token = await $.ajax({
                url: '/api/auth/admin',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });

            console.log('Auth / Admin token', token);
            //console.log(token.getResponseHeader("UserName"));
            const UserName = 'AlexWatkins'
            if(token) window.location.href = `/admin/${UserName}`
        }catch (ex){
            console.log(ex.responseText);
            switch(ex.responseText) {
                case "Invalid email or password" :
                    $('#incorrect-danger').show().text("Invalid email or password");
                    setTimeout(function() {
                        $('#incorrect-danger').hide().text();
                    }, 2000);
                    break;
                case "User is not an Administrator" :
                        $('#incorrect-danger').show().text("User is not an Administrator");
                        setTimeout(function() {
                            $('#incorrect-danger').hide().text();
                        }, 2000);
                        break;
            }
        }   
    })
})();