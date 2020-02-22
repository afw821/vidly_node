$(document).ready(async function () {
    //Redirect if user isn't logged in
    const token = sessionStorage.getItem('x-auth-token');
    if (!token) {
        window.location.href = '/admin';

        alert('Only administrators can see this page!!');
    }
    //Get html string from server to Add Movies to DB
    try {
        const data = await $.ajax({
            url: '/api/addMovie',
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        const defaultOption = '<option selected class="option-genre" value="">Select Genre</option>';
        const optionList = data.options;
        $('.movie-dump').append(data.htmlString);
        $('.movie-dump').find('.selectList').append(defaultOption);
        optionList.forEach(function (option, i, arr) {
            $('.movie-dump').find('.selectList').append(option);
        });

        //re index array (alphabetical order dd list)
        reindexArray('#genre-selectList');

    } catch (ex) {
        alert('Fatal Error');
    }
    //Get html string from server to DELETE Movies FROM DB
    try {
        const data = await $.ajax({
            url: '/api/getDeleteMovie',
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        const defaultOption = '<option selected class="option-movie">Select Movie to Delete</option>';
        const optionList = data.options;
        $('.delete-movie-dump').append(data.htmlString);
        $('.delete-movie-dump').find('.selectList').append(defaultOption);
        optionList.forEach(function (option, i, arr) {
            $('.delete-movie-dump').find('.selectList').append(option);
        });

        //re index array (alphabetical order dd list)
        reindexArray('#movie-selectList');

    } catch (ex) {
        alert('Fatal Error getting delete movie list');
    }
    //Get html string from server to GET ALL USERS
    try {
        const data = await $.ajax({
            url: '/api/getUsers',
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        const defaultOption = '<option selected class="option-user">Select User to Edit...</option>';
        const optionList = data.options;
        $('.user-dump').append(data.htmlString);
        $('.user-dump').find('.selectList').append(defaultOption);
        optionList.forEach(function (option, i, arr) {
            $('.user-dump').find('.selectList').append(option);
        });

        //onchange
        $('#user-selectList').on('change', function (e) {
            const val = $(this).val();
            $(this).children().each(function (i, ele) {
                if (val == $(ele).val()) {
                    $('label').removeClass('active');

                    const userName = $(ele).text();
                    const userEmail = $(ele).data('email');

                    $('.user-input').prop('disabled', false).empty();
                    $('#user-name-input').val(userName);
                    $('#user-email-input').val(userEmail);
                    $('#put-user').prop('disabled', false);
                    $('#put-user').attr('data-user-id', val);
                }
            });
        });

    } catch (ex) {
        alert('Fatal Error getting all users');
    }

    //Get html string from server to Create Admin
    try {
        const data = await $.ajax({
            url: '/api/getCreateAdmin',
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        $('.create-admin-dump').append(data.htmlString);

        //create a new admin
        $('#create-admin').click(function () {
            const name = $('#User-Name').val();
            const email = $('#User-Email').val();
            const firstPassword = $('#First-Password').val().trim();
            const password = $('#User-Password').val().trim();
            const doesPasswordMatch = firstPassword === password;
            if (name.length < 5)
                return validation.reviewValidation('User-Name', 5, true);
            if (email.length < 5)
                return validation.reviewValidation('User-Email', 5, true);
            if (firstPassword.length < 5)
                return validation.reviewValidation('First-Password', 5, true);
            if (password.length < 5)
                return validation.reviewValidation('User-Password', 5, true);
            if (!doesPasswordMatch)
                return validation.match('First-Password', 'User-Password', true);


        });

    } catch (ex) {
        alert('Fatal Error getting add adin');
    }



    //switch between tabs on navbar
    //1. users
    $('a.nav-item').click(function () {
        const route = $(this).data('route');
        //underline tabs
        $('a.nav-item').each(function (i, ele) { $(ele).removeClass('active'); });
        $(this).addClass('active');
        //hide show rows
        $('.admin-row').hide();
        $(`.admin-${route}-row`).show();
    });
    //UPDATE USER...................///
    //*****************************/ */
    $('#put-user').click(async function () {
        const userId = $(this).data('user-id');

        const result = await $.ajax({
            url: `/api/users/${userId}`,
            method: 'PUT',
            data: {
                name: $('#user-name-input').val(),
                email: $('#user-email-input').val(),
                password: $('#user-confirm-password-input').val()
            },
            headers: { 'x-auth-token': token }
        });

        if (result.status) {
            alert('User Updated!');

            $('.user-input').val(""); //clear input
            //update list w / o refresh
            const email = result.user.email;
            const id = result.user._id;
            const userName = result.user.name;
            const optionElement = `<option class="option-user" data-email="${email}" value="${id}">${userName}</option>`;
            //loop through option list and replace old with new
            $('#user-selectList').children('option').each(function (i, ele) {
                const val = $(ele).val();

                if (val == id) {
                    $(ele).replaceWith(optionElement);
                }
            });
        }
    });

    //ADD MOVIE TO DB AJAX AND LOGIC///
    //*****************************/ */
    $('#add-movie').click(async function () {
        try {
            //get data from form
            const title = $('#add-movie-title').val();
            const genreId = $('#genre-selectList').val();
            const numberInStock = parseInt($('#number-in-stock').val());
            const dailyRentalRate = parseInt($('#rental-rate').val());
            const result = await $.ajax({
                url: '/api/movies',
                method: 'POST',
                data: {
                    title: title,
                    genreId: genreId,
                    numberInStock: numberInStock,
                    dailyRentalRate: dailyRentalRate
                },
                headers: { 'x-auth-token': token }
            });

            if (result.result) {
                alert('Movie Sucessfully posted!');
            }
        } catch (ex) {
            alert(`Fatal error for post movie`);
        }
    });
    //DELETE MOVIE TO DB AJAX AND LOGIC///
    //*****************************/ */
    $('#delete-movie').click(async function () {
        try {
            //get data from form
            const movieId = $('#movie-selectList').val();

            const result = await $.ajax({
                url: `/api/movies/${movieId}`,
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (result.result) {
                alert('Movie Sucessfully deleted!');

            }
        } catch (ex) {
            alert(`Fatal error for delete movie`);
        }
    });

    //logout
    $('.logout').click(function () {
        sessionStorage.clear();
        window.location.href = '/admin';
    });

    function reindexArray(args) {

        const reindexArray = [];

        $(args).find('option').each(function (index, element) {

            if ($(this).val()) {
                const value = $(element).val();
                const name = $(element).text();
                let reindexObject = { name: name, value: value }
                reindexArray.push(reindexObject);
            }
        });

        $(args).find('option').first().siblings().remove();
        // sort by name
        reindexArray.sort(function (a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA > nameB) {
                return -1;
            }
            if (nameA < nameB) {
                return 1;
            }
            return 0;
        });
        reindexArray.forEach(function (element, index, arr) {
            const id = element.value;
            const name = element.name;
            const sortedElement = `<option class="option-genre" value="${id}">${name}</option>`;

            $(args).find('option').first().after(sortedElement);
        });
    }

});

