const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Orders = require('../models/orders');

const customerAuth = async(req, res, next) => {
    try {
        const token = req.get('Authorization');
        const customer = jwt.verify(token, process.env.JWT_PASS);
        // console.log(customer);
        const dbCustomer = await Orders.findOne({ customerName: customer.customerName, customerContact: customer.customerContact });
        if (dbCustomer) {
            req.customer = dbCustomer;
            next();
        } else {
            return res
                .status(403)
                .json({ message: 'You are forbidden from modifying this resource' });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({ error: err });
    }
};

module.exports = customerAuth;