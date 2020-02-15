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

    var genreSelectList = `                <form class="d-flex justify-content-center align-items-center">
    <div class="form-content-wrapper-div">
        <div class="row header-row d-flex justify-content-center">
            <h4>Select User</h4>
        </div>
        <div class="form-row select-user-form-row">
            <div class="col">
                <select class="selectList" id="user-selectList">

                </select>
            </div>
        </div>

        <div class="form-row d-flex justify-content-center">
            
                           
        </div>           
    </div>            
</form>`

    res.send({ htmlString: genreSelectList, options: optionListArray});
}));

module.exports = router;