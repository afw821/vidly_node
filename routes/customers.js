const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();
//get all genres
router.get('/', async function (req, res) {
    const customers = await Customer.find();
    res.send(customers);
});
//post a course
router.post('/', async function (req, res) {
    //validate the req.body object
    const result = validate(req.body);
    //if invalid return a 404 error to the client
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
        return;
    }
    //define the new customer you want to POST to the DB
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    //save customer to db await it and send res to the client
    customer = await customer.save();
    res.send(customer);
});
//get customer by id
router.get('/:id', async function (req, res) {
    const customer = await Customer.findById(req.params.id);
    //if course doesn't exist return 404
    if(!customer) {
        res.status(404).send('The requested id does not exist');
        return;
    }

    res.send(customer);
});