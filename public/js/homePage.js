
$(document).ready(async function () {
    const token = localStorage.getItem('x-auth-token');

    //---------------------------------------------------------//
    //GET CURRENT USER
    //--------------------------------------------------------//

    const user = await $.ajax({
        url: '/api/users/me',
        method: 'GET',
        headers: { 'x-auth-token': token }
    });
    console.log(user);
    var userId = user._id;
    var userName = user.name;
    var userEmail = user.email;
    var isUserAdmin = user.isAdmin;
    
    //---------------------------------------------------------//
    //GET ALL MOVIES FROM THE DB AND BUILD OUT THE GRID
    //--------------------------------------------------------//
    const movies = await $.ajax({
        url: '/api/movies',
        method: 'GET'
    });

    $(movies).each(function (i, e) {
        const dailyRentalRate = movies[i].dailyRentalRate;
        const numberInStock = movies[i].numberInStock;
        const movieName = movies[i].title;

        const movieCard = $('<div>', {
            class: 'movie-card card',
            style: 'width: 18rem;',
        });
        const movieCardBody = $('<div>', {
            class: 'movie-card-body card-body',
            appendTo: movieCard
        });
        const h5 = $('<h5>', {
            class: 'movie-card-title card-title',
            text: movieName,
            appendTo: movieCardBody
        });
        const inStock = $('<p>', {
            class: 'card-text',
            text: `Only ${numberInStock} Left In Stock!`,
            appendTo: h5
        });
        const price = $('<div>', {
            class: 'card-text',
            text: `$${dailyRentalRate} / Day`,
            appendTo: h5
        });
        const button = $('<a>', {
            class: 'btn btn-primary',
            text: 'Add To Cart',
            appendTo: h5
        });
        $('.movie-container').append(movieCard);
    });

});