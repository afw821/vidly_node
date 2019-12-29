
$(document).ready(async function () {
  const token = sessionStorage.getItem("x-auth-token");
  const user = await $.ajax({
    url: "/api/users/me",
    method: "GET",
    headers: { "x-auth-token": token }
  });
  if (!user) alert('No user so error');
  var userId = user._id;
  var userName = user.name;
  var userEmail = user.email;
  var userCartId = user.cartId;
  //get cart by cart id and return movies array to build out the grid
  //get cart by cart id
  const result = await $.ajax({
    url: `/api/carts/${userCartId}`,
    method: 'GET'
  });
  if (result.result) {
    const moviesArray = result.movies;
    buildMovieGrid(moviesArray, '.checkout-container', userCartId, 'checkout', userId);
  }

});