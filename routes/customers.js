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
    if (result.error) {
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
    if (!customer) {
        res.status(404).send('The requested id does not exist');
        return;
    }

    res.send(customer);
});
router.put('/:id', async function (req, res) {
    //validate user input
    const result = validate(req.body);
    //if invalid return 400 bad request
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
            new: true // new true returns the new updated genre
        });
    //if the customer doesn't exist return 404
    if (!customer) {
        res.status(404).send("The requested genre doesn't exist");
        return;
    }
    //send response to the client
    res.send(customer);
});

router.delete('/:id', async function (req, res) {
    const customer = await Customer.findByIdAndRemove( req.params.id);

    //if customer doesn't exist send 404 error to the client
    if (!customer) {
        res.send(404).send("the requested customer doesn't exist");
        return;
    }
    //return removed customer
    res.send(customer);
});

module.exports = router;