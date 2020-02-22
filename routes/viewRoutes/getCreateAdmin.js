const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../../middleware/admin');

router.get('/', [ auth, admin ], ash(async function (req, res) {

    var createAdminForm = `                    <form class="d-flex justify-content-center pt-4" style="height:375px;">
    <div class="form-content-wrapper-div">
        <div class="row header-row d-flex justify-content-center">
            <h4>Create Administrator</h4>
        </div>

        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Admin Name</label>
                <input id="User-Name" type="text" class="form-control admin-input">
            </div>
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Email</label>
                <input id="User-Email" type="text" class="form-control admin-input">
            </div>

        </div>
        <div class="form-row d-flex justify-content-center mt-3">
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Password</label>
                <input id="First-Password" type="password" class="form-control admin-input">
            </div>
            <div class="col">
                <label class="admin-label" id="user-name-label" style="border:none !important;">Confirm</label>
                <input id="User-Password" type="password" class="form-control admin-input">
            </div>

        </div>
        <div class="form-row d-flex justify-content-center" style="margin-top:15px;">
            <button type="button" id="create-admin" class="btn btn-primary">Create</button>
        </div>
        <div class="alert alert-danger review-validation" style="display:none;" role="alert">
        </div>
    </div>
</form>`

    res.send({ htmlString: createAdminForm });
}));

module.exports = router;