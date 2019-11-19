const { Movie, validate } = require("../../models/movie");
const { Genre } = require("../../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../../middleware/admin');

router.get('/', [auth, admin], ash(async function (req, res) {
    //get all genres
    const genres = await Genre.find();
    var optionListArray = [];
    for (let i = 0; i < genres.length; i++) {
        var genre = genres[i].name;
        var id = genres[i]._id;

        var optionList = `<option class="option-genre" value="${id}">${genre}</option>`;

        optionListArray.push(optionList);
    }
        const option = optionListArray.map( m => m);
        var genreSelectList = `<form>
        <div class="form-row">
            <div class="col">
                <input type="text" class="form-control" placeholder="Title">
            </div>
            <div class="col">
                <select class="selectList" id="genre-selectList">
               
                  </select>
            </div>
        </div>
    </form>`

    res.send({
        htmlString: genreSelectList,
        options : option
    });


    //build out html string to send back to the client
}));

module.exports = router;