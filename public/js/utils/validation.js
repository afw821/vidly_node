const validation = {

  reviewValidation: function (args, length, bool) {
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
  },

  authValidation: function (args, bool) {
    const email = `<b>${args} must be a valid Email</b>`;
    const password = `<b>Invalid Email and / or Password</b>`;
    $('.review-validation').show().html(bool ? email : password);
    if (args) $(`#${args}`).css('border', '1px solid red');
    setTimeout(function () {
      if (args) $(`#${args}`).css('border', '1px solid #ced4da');
      $('.review-validation').hide().empty();
    }, 4000);
  },

  match: function (args, args2, bool) {
    const match = `<b>Passwords must match</b>`;
    const nameTaken = `<b>Account already registered with this E-Mail</b>`;
    $('.review-validation').show().html(bool ? match: nameTaken);
    $(`#${args}, #${args2}`).css('border', '1px solid red');
    setTimeout(function () {
      $(`#${args},#${args2}`).css('border', '1px solid #ced4da');
      $('.review-validation').hide().empty();
    }, 4000);
  }
}