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
            console.log('movie id', movieId);
            const result = await $.ajax({
                url: `/api/movies/${movieId}`,
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (result.result) {
                alert('Movie Sucessfully deleted!');
                console.log('movie deleted', result.movieDeleted);
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
})();