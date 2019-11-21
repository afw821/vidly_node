(async function () {

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
        const defaultOption = '<option selected class="option-genre">Select Genre</option>';
        const optionList = data.options;
        $('.movie-dump').append(data.htmlString);
        $('.movie-dump').find('.selectList').append(defaultOption);
        optionList.forEach(function (option, i, arr) {
            $('.movie-dump').find('.selectList').append(option);
        });
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
       
    } catch (ex) {
        alert('Fatal Error getting delete movie list');
    }
    //ADD MOVIE TO DB AJAX AND LOGIC///
    //*****************************/ */
    $('#add-movie').click(async function () {
        try {
            //get data from form
            const title = $('#add-movie-title').val();
            const genreId = $('#genre-selectList').val();
            const numberInStock = parseInt($('#number-in-stock').val());
            console.log('numer in stock', numberInStock);
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
                console.log('movie', result.movie);
            }
        } catch (ex) {
            alert(`Fatal error for post movie`);
        }
    });


    //logout
    $('.logout').click(function () {
        sessionStorage.clear();
        window.location.href = '/admin';
    })

})();