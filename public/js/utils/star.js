
function star(e) {
    //clear all if ANY of the stars are checked AND the one you click is checked ***AND*** there are no more checked after the one clicked
    //This clears them if you click on a yellow star//****** */
    const starClicked = parseInt(e.target.id);
    if ($('span.fa-star').hasClass('checked') && (e.target.classList[3]) && !(e.currentTarget.nextElementSibling.classList[3])) {
        //remove all of them
        $('span.fa-star').removeClass('checked');
        return;
    }
    //if ANY of the stars are checked AND the one you click is checked ***AND*** there ARE more checked after the one clicked ONLY clear the ones after the one clicked
    if ($('span.fa-star').hasClass('checked') && (e.target.classList[3])) {
        switch (starClicked) {
            case 1:
                $('#2').removeClass('checked');
                $('#3').removeClass('checked');
                $('#4').removeClass('checked');
                $('#5').removeClass('checked');
                break;
            case 2:
                $('#3').removeClass('checked');
                $('#4').removeClass('checked');
                $('#5').removeClass('checked');
                break;
            case 3:
                $('#4').removeClass('checked');
                $('#5').removeClass('checked');
                break;
            case 4:
                $('#5').removeClass('checked');
                break;
        }
        return;
    }
    //if no stars are checked we add yellow to all the ones behind the one and including the one clicked
    if (!$('span.fa-star').hasClass('checked')) {
        switch (starClicked) {
            case 1:
                $('#1').addClass('checked');
                break;
            case 2:
                $('#1').addClass('checked');
                $('#2').addClass('checked');
                break;
            case 3:
                $('#1').addClass('checked');
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                break;
            case 4:
                $('#1').addClass('checked');
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                $('#4').addClass('checked');
                break;
            case 5:
                $('#1').addClass('checked');
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                $('#4').addClass('checked');
                $('#5').addClass('checked');
                break;
        }
        return;
    } else if ($('span.fa-star').hasClass('checked') && (e.currentTarget.previousElementSibling.classList[3])) { //else we are adding stars when there are already stars behind one clicked . any stars checked 2. there are stars behind the one checked
        switch (starClicked) {
            case 2:
                $('#2').addClass('checked');
                break;
            case 3:
                $('#3').addClass('checked');
                break;
            case 4:
                $('#4').addClass('checked');
                break;
            case 5:
                $('#5').addClass('checked');
                break;
        }
        return;
    } else {
        switch (starClicked) {
            case 3:
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                break;
            case 4:
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                $('#4').addClass('checked');
                break;
            case 5:
                $('#2').addClass('checked');
                $('#3').addClass('checked');
                $('#4').addClass('checked');
                $('#5').addClass('checked');
                break;
        }
        return;
    }
}
