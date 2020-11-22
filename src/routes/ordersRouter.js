const orders = require('../controllers/ordersController');
const customerAuth = require('../middlewares/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

// POST

/**
 * @typedef CreateOrderRequest
 * @property {string} customerName.required
 * @property {string} password.required
 * @property {number} customerContact.required
 * @property {Array.<Item>} order.required
 * @property {string} deadLineTime
 * @property {string} status
 */
/**
 * @typedef CreateOrderResponse
 * @property {string} message
 * @property {Order.model} createdOrder
 * @property {string} token
 */

router.post('/', async(req, res) => {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    let response;
    try {
        if (req.body.password.length > 7) {
            req.body.password = bcrypt.hashSync(req.body.password, salt);
            response = await orders.createOrder(req.body);
            console.log(response);
            if (response.isError) {
                return res.status(422).send(response);
            }
            const payload = {
                customerName: response.createdOrder.customerName,
                customerContact: response.createdOrder.customerContact,
                password: response.createdOrder.password
            };
            const token = jwt.sign(JSON.stringify(payload),
                process.env.JWT_PASS);
            response.token = token;
            return res.status(response.isError ? 400 : 200).send(response);
        } else {
            return res.status(422).send({
                message: 'Password length should be greater than 7 characters'
            });
        }

    } catch (err) {
        return res.status(403).send(response);
    }
});

// GET

/**
 * @typedef GetYourOrderRequest
 */
/**
 * @typedef GetYourOrderResponse
 * @property {Order.model} order
 */

router.get('/', customerAuth, async(req, res) => {
    const order = await orders.getOrder(req.customer);
    return res.status(order.isError ? 400 : 200).send(order);
});

// PATCH

/**
 * @typedef PatchYourOrderRequest
 * @property {Order.model} order
 */

/**
 * @typedef PatchYourOrderResponse
 * @property {string} message
 * @property {Order.model} order
 */

router.patch('/', customerAuth, async(req, res) => {
    const order = await orders.updateOrder(req.customer, req.body);
    return res.status(order.isError ? 400 : 200).send(order);
});

// DELETE

/**
 * @typedef DeleteYourOrderRequest
 */

/**
 * @typedef DeleteYourOrderResponse
 * @property {string} message
 * @property {Order.model} order
 */

router.delete('/', customerAuth, async(req, res) => {
    const order = await orders.deleteOrder(req.customer);
    return res.status(order.isError ? 400 : 200).send(order);
});

module.exports = router;