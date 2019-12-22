  //reuseable review validation functions
  function reviewValidation(args, length, bool) {
    const html = `<b>${args} must be at least ${length} Characters in length</b>`;
    const starHtml = `<b>Must leave at least a ${length} star review`;
    $('.review-validation').show().html(bool ? html : starHtml);
    $(`#${args}`).css('border', '1px solid red');
    setTimeout(function () {
      $(`#${args}`).css('border', function () {
        return bool ? '1px solid #ced4da' : 'none';
      });
      $('.review-validation').hide().empty();
    }, 4000);
    return;
  }