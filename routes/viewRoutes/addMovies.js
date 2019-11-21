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

    if(!genres) return res.status(404).send('Genre was not located');
    var optionListArray = [];
    for (let i = 0; i < genres.length; i++) {
        var genre = genres[i].name;
        var id = genres[i]._id;

        var optionList = `<option class="option-genre" value="${id}">${genre}</option>`;

        optionListArray.push(optionList);
    }
        const option = optionListArray.map( m => m);
        var genreSelectList = `                <form class="d-flex justify-content-center align-items-center">
        <div class="form-content-wrapper-div">
            <div class="row header-row d-flex justify-content-center">
                <h4>Add Movie</h4>
            </div>
            <div class="form-row add-movie-form-row">
                <div class="col">
                    <input type="text" class="form-control add-movie" id="add-movie-title"
                        placeholder="Title">
                </div>
                <div class="col">
                    <select class="selectList" id="genre-selectList">

                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <input type="text" class="form-control add-movie" id="number-in-stock"
                        placeholder="Number In Stock">
                </div>
                <div class="col">
                    <input type="text" class="form-control add-movie" id="rental-rate"
                        placeholder="Daily Rental Rate">
                </div>
            </div>
            <div class="form-row d-flex justify-content-center">
                
                <button type="button" id="add-movie" class="btn btn-primary">Add</button>               
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