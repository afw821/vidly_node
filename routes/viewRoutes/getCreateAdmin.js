const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../../middleware/admin');

router.get('/', [ auth, admin ], ash(async function (req, res) {

    var createAdminForm = `                    <form class="d-flex justify-content-center pt-4">
    <div class="form-content-wrapper-div">
        <div class="row header-row d-flex justify-content-center">
            <h4>Create Administrator</h4>
        </div>

        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Admin Name</label>
                <input id="admin-name-input" type="text" class="form-control admin-input">
            </div>
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Email</label>
                <input id="admin-email-input" type="text" class="form-control admin-input">
            </div>

        </div>
        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">New Password</label>
                <input id="admin-password-input" type="password" class="form-control admin-input">
            </div>
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Confirm</label>
                <input id="admin-confirm-password-input" type="password" class="form-control admin-input">
            </div>

        </div>
        <div class="form-row d-flex justify-content-center">
            <button type="button" id="put-user" class="btn btn-primary">Create</button>
        </div>
    </div>
</form>`

    res.send({ htmlString: createAdminForm });
}));

module.exports = router;