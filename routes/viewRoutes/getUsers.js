const { User, validate } = require("../../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../../middleware/admin');

router.get('/', [ auth, admin ], ash(async function (req, res) {

    const users = await User.find();

    if(!users) return res.status(404).send('Movie was not located');

    var optionListArray = [];

    for ( let i = 0; i < users.length; i++) {
        var userName = users[i].name;
        var id = users[i]._id;
        var email = users[i].email;
        var optionList = `<option class="option-user" data-email="${email}" value="${id}">${userName}</option>`;
        optionListArray.push(optionList);
    }

    var genreSelectList = `                    <form class="d-flex justify-content-center pt-4">
    <div class="form-content-wrapper-div">
        <div class="row header-row d-flex justify-content-center">
            <h4>Select User</h4>
        </div>
        <div class="form-row select-user-form-row">
            <div class="col d-flex justify-content-center">
                <select class="selectList" id="user-selectList">

                </select>
            </div>
        </div>

        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="user-label" id="user-name-label" style="border:none !important;">User Name</label>
                <input id="user-name-input" type="text" disabled class="form-control user-input">
            </div>
            <div class="col">
                <label class="user-label" id="user-name-label" style="border:none !important;">Email</label>
                <input id="user-email-input" type="text" disabled class="form-control user-input">
            </div>

        </div>
        <div class="row header-row d-flex justify-content-center mt-2">
            <h4>Change Password</h4>
        </div>
        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="user-label" id="user-name-label" style="border:none !important;">New Password</label>
                <input id="user-password-input" type="password" disabled class="form-control user-input">
            </div>
            <div class="col">
                <label class="user-label" id="user-name-label" style="border:none !important;">Confirm</label>
                <input id="user-confirm-password-input" type="password" disabled class="form-control user-input">
            </div>

        </div>
        <div class="form-row d-flex justify-content-center">
            <button type="button" id="put-user" disabled class="btn btn-primary">Update</button>
        </div>
    </div>
</form>`

    res.send({ htmlString: genreSelectList, options: optionListArray});
}));

module.exports = router;