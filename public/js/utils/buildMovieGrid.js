
function buildMovieGrid(array, container, userCartId, modal, userId) {
    for (let i = 0; i < array.length; i++) {
        const name = array[i].title;
        const price = array[i].dailyRentalRate;
        const numberInStock = array[i].numberInStock;
        const movieId = array[i]._id;
        const genreName = array[i].genre.name;
        const genreId = array[i].genre._id;

        const trBody = $('<tr>', {
            class: 'table-row-cart',
            mouseenter: function () {
                this.style.background = 'lightgray';
            },
            mouseleave: function () {

                modal == 'home' ? this.style.background = '#fdf9f3' : this.style.background = 'white';
            }
        });
        const tdTitle = $('<td>', {
            text: name,
            id: movieId,
            "data-genre-id": genreId,
            "data-movie-id": movieId,
            appendTo: trBody
        });
        const tdPrice = $('<td>', {
            text: `$${price}`,
            id: movieId,
            "data-genre-id": genreId,
            "data-movie-id": movieId,
            appendTo: trBody
        });
        const tdStock = $('<td>', {
            text: numberInStock,
            id: movieId,
            "data-genre-id": genreId,
            "data-movie-id": movieId,
            appendTo: trBody
        });
        if (modal == 'search' || modal == 'home') {
            const tdBtn = $('<td>', {
                style: 'cursor: pointer;',
                html: `<i data-user-id="${userId}" data-movieid="${movieId}" class="fas fa-plus add-to-cart"></i>`,
                appendTo: trBody
            });
        } else if (modal == 'cart') {
            const tdBtn = $('<td>', {
                style: 'cursor: pointer;',
                html: `<a href="#" data-cart-id="${userCartId}" data-movie-id="${movieId}" class="badge badge-light" id="remove-cart-item-${userCartId}">Remove</a>`,
                appendTo: trBody
            });
        }
        $(container).find('tbody').append(trBody);
    }
}