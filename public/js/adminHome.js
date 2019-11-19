(async function () {
   
    //Redirect if user isn't logged in
    const token = sessionStorage.getItem("Admin-Token");
    if (!token) {
      window.location.href = '/admin';
  
      alert('Only administrators can see this page!!');
    }

    try{
        const data = await $.ajax({
            url: '/api/addMovie',
            method: 'GET',
        });
        const defaultOption = '<option selected class="option-genre">Select Genre</option>';
        const optionList = data.options;
        $('.movie-dump').append(data.htmlString);
        $('.movie-dump').find('.selectList').append(defaultOption)
        optionList.forEach(function(option, i, arr) {
            $('.movie-dump').find('.selectList').append(option);
        });
    }catch(ex) {
        alert('Fatal Error');
    }

    
    //logout
    $('.logout').click(function() {
        sessionStorage.clear();
        window.location.href = '/admin';
    })
    
})();