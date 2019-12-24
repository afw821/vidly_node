
function buildReviews (array, container) {
    for(let i = 0; i < array.length; i++) {

        const comment = array[i].comment;
        const date = array[i].date;
        const subject = array[i].subject;
        const stars = array[i].stars;
        const userId = array[i].user._id;
        const userEmail = array[i].user.email;
        const userName = array[i].user.name;
        
        const reviewWrapper = $('<div>', {
          class: "card text-center review-wrapper-div mb-4",
          id: userId
        });
        const reviewHeader = $('<div>', {
          class: "review-header card-header",
          text: `By: ${userName}  ${date}`,
          appendTo: reviewWrapper
        });
        const reviewBody = $('<div>', {
          class: "card-body review-body",
          appendTo: reviewWrapper
        });
        const reviewSubject = $('<h5>', {
          class: "card-title review-subject",
          text: subject,
          appendTo: reviewBody
        });
        const reviewComment = $('<p>', {
          class: "card-text review-comment",
          text: comment,
          appendTo: reviewBody
        });
        const reviewStarsDiv = $('<div>', {
          class: "card-footer text-muted review-stars-div",
          appendTo: reviewWrapper
        });
        const oneStar = $('<span>', {
          class: function () {
            if(stars >= 1) return 'fa fa-star one-star checked';

            return 'fa fa-star one-star';
          },
          appendTo: reviewStarsDiv
        });
        const twoStar = $('<span>', {
          class: function () {
            if(stars >= 2) return 'fa fa-star two-star checked';

            return 'fa fa-star two-star';
          },
          appendTo: reviewStarsDiv
        });
        const threeStar = $('<span>', {
          class: function () {
            if(stars >= 3) return 'fa fa-star three-star checked';

            return 'fa fa-star three-star';
          },
          appendTo: reviewStarsDiv
        });
        const fourStar = $('<span>', {
          class: function () {
            if(stars >= 4) return 'fa fa-star four-star checked';

            return 'fa fa-star four-star';
          },
          appendTo: reviewStarsDiv
        });
        const fiveStar = $('<span>', {
          class: function () {
            if(stars == 5) return 'fa fa-star five-star checked';

            return 'fa fa-star five-star';
          },
          appendTo: reviewStarsDiv
        });

        $(container).append(reviewWrapper);
      }
}