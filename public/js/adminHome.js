(async function () {
    console.log('Hello World!');
    //Redirect if user isn't logged in
    const token = sessionStorage.getItem("Admin-Token");
    if (!token) {
      window.location.href = '/admin';
  
      alert('Only administrators can see this page!!');
    }
    //get all genres to add to the dropdown list dynamically
    const genres = await $.ajax({
        url: '/api/genres',
        method: 'GET'
    });
    console.log(genres);

    for(let i = 0; i < genres.length; i++) {
        console.log(genres[i].name);
        const genre = genres[i].name;
        const id = genres[i]._id;

        var optionList = `<option class="option-genre" value="${id}">${genre}</option>`
        $('.default').after(optionList);
    }
    console.log(optionList);
    // genres.forEach(function(v,i,arr) {
    //     console.log(v);
    //     const id = v._id;
    //     const genre = v.name;
    //     console.log(genre);
    //     const optionList = `<option class="option-genre" value="${id}">${genre}</option>`
        
    // });
    //logout
    $('.logout').click(function() {
        sessionStorage.clear();
        window.location.href = '/admin';
    })
    
})();