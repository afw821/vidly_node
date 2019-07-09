console.log(StateManager.GetData('UserName'));
$(document).ready(async function () {
    
    

    const movies = await $.ajax({
        url: '/api/movies',
        method: 'GET'
    });
    //console.log(movies);
    $(movies).each(function (i, e) {
        const dailyRentalRate = movies[i].dailyRentalRate;
        const numberInStock = movies[i].numberInStock;
        const movieName = movies[i].title;
        //console.log(dailyRentalRate);
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