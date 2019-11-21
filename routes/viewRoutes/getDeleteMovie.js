const { Movie, validate } = require("../../models/movie");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ash = require('express-async-handler');
const admin = require('../../middleware/admin');

router.get('/', [ auth, admin ], ash(async function (req, res) {

    const movies = await Movie.find();

    if(!movies) return res.status(404).send('Movie was not located');

    var optionListArray = [];

    for ( let i = 0; i < movies.length; i++) {
        var movie = movies[i].title;
        var id = movies[i]._id;
        var optionList = `<option class="option-movie" value="${id}">${movie}</option>`;
        optionListArray.push(optionList);
    }

    var genreSelectList = `                <form class="d-flex justify-content-center align-items-center">
    <div class="form-content-wrapper-div">
        <div class="row header-row d-flex justify-content-center">
            <h4>Delete Movie</h4>
        </div>
        <div class="form-row delete-movie-form-row">
            <div class="col">
                <select class="selectList" id="movie-selectList">

                </select>
            </div>
        </div>

        <div class="form-row d-flex justify-content-center">
            
            <button type="button" id="delete-movie" class="btn btn-primary">Delete</button>               
        </div>           
    </div>            
</form>`

    res.send({ htmlString: genreSelectList, options: optionListArray});
}));

module.exports = router;