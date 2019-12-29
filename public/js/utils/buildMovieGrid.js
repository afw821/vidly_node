
async function buildMovieGrid(array, container, userCartId, modal, userId) {
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

                modal == 'home' || modal == 'checkout' ? this.style.background = '#fdf9f3' : this.style.background = 'white';
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
        if (modal == 'checkout') {
            const tdStock = $('<td>', {
                class: 'closest-td',
                html: `<select id="select-${movieId}" class="qty-select-list">
                <option selected>Select Qty</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>`,
                id: movieId,
                "data-genre-id": genreId,
                "data-movie-id": movieId,
                appendTo: trBody
            });
        } else {
            const tdStock = $('<td>', {
                text: numberInStock,
                id: movieId,
                "data-genre-id": genreId,
                "data-movie-id": movieId,
                appendTo: trBody
            });
        }

        if (modal == 'search' || modal == 'home') {
            const tdBtn = $('<td>', {
                style: 'cursor: pointer;',
                appendTo: trBody
            });
            const i = $('<i>', {
                'data-user-id': userId,
                'data-movieid': movieId,
                class: 'fas fa-plus add-to-cart',
                click: async function () {
                    try {
                        const movieId = $(this).attr('data-movieid');
                        const result = await $.ajax({
                            url: '/api/carts',
                            method: 'POST',
                            data: {
                                userId: userId,
                                movieId: movieId
                            }
                        });

                        if (result.status && result.cart) { // first time creating a new cart
                            console.log('creating new cart');
                            //userCartId = result.cart._id;
                        } else if (result.status && result.updatedCart) { //else updating a cart
                            console.log('we successfully added a movie to an existing cart');
                        }
                    } catch (ex) {
                        console.log(`Ex posting a cart: ${ex}`);
                    }
                },
                appendTo: tdBtn
            });
        } else if (modal == 'cart') {
            const tdBtn = $('<td>', {
                style: 'cursor: pointer;',
                html: `<a href="#" data-cart-id="${userCartId}" data-movie-id="${movieId}" class="badge badge-light" id="remove-cart-item-${userCartId}">Remove</a>`,
                appendTo: trBody
            });
        } else if (modal == 'checkout') {
            const tdBtn = $('<td>', {
                style: 'cursor: pointer;',
                appendTo: trBody
            });
            const checkoutBtn = $('<button>', {
                class: 'btn btn-primary btn-sm',
                'data-user-id': userId,
                'data-movieid': movieId,
                'data-user-cart-id': userCartId,
                text: 'Checkout',
                click: async function () {
                    try {
                        const quantity = parseInt($(this).parent('td').prev().children('select').val());
                        const movieId = $(this).data('movieid');
                        const userId = $(this).data('user-id');
                        const rental = await $.ajax({
                            url: '/api/rentals',
                            method: 'POST',
                            data: {
                                userId: userId,
                                movieId: movieId,
                                quantity: quantity
                            }
                        });
                        console.log('rental', rental);
                        alert('You rental was successful! Enjoy!');
                    } catch (ex) {
                        console.log(ex.responseText);
                        switch (ex.responseText) {
                            case `Not enough movies left in stock. Only ${numberInStock} left`:
                                alert(ex.responseText);
                                break;
                            case 'Movie not in stock':
                                alert(ex.responseText);
                        }
                    }
                },
                appendTo: tdBtn
            });
        }
        $(container).find('tbody').append(trBody);
    }
}

