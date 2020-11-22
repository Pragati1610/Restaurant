const auth = require('../controllers/authController');
const dotenv = require('dotenv');
dotenv.config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminAuth = require('../middlewares/auth');

// POST

/**
 * @typedef AdminSignupRequest
 * @property {string} authName.required
 * @property {string} password.required
 */
/**
 * @typedef AdminSignupResponse
 * @property {string} message
 * @property {Admin.model} createdAdmin
 * @property {string} token
 */

router.post('/signup', async(req, res) => {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const response = await auth.createAuth(req.body);
    console.log(response);
    if (response.isError) {
        return res.status(400).send(response);
    } else {
        const token = jwt.sign(JSON.stringify(response.createdAuth),
            process.env.JWT_PASS);
        response.token = token;
        return res.status(response.isError ? 400 : 200).send(response);
    }
});

/**
 * @typedef AdminLoginRequest
 * @property {string} authName.required
 * @property {string} password.required
 */
/**
 * @typedef AdminLoginResponse
 * @property {string} token
 */

router.post('/login', async(req, res) => {
    const authUser = await auth.getAuthByAuthName(req.body.authName);
    console.log(authUser);
    if (authUser) {
        const match = bcrypt.compareSync(req.body.password, authUser.password);
        const token = jwt.sign(JSON.stringify(authUser), process.env.JWT_PASS);
        return res.status(match ? 200 : 400).send({ token });
    } else {
        return res.status(400).send({ message: "User doesn't exist, please signup first" });
    }

});

// GET

/**
 * @typedef GetAllOrdersRequest
 */

/**
 * @typedef GetAllOrdersResponse
 * @property {Array.<Order>} Order
 */

router.get('/allOrders', adminAuth, async(req, res) => {
    const response = await auth.getAllOrders();
    return res.status(response.isError ? 400 : 200).send(response);
});

/**
 * @typedef GetAttendedOrdersRequest
 */
/**
 * @typedef GetAttendedOrdersResponse
 * @property {Array.<Order>} Order
 */
router.get('/attendedOrders', adminAuth, async(req, res) => {
    const response = await auth.attendedOrders();
    return res.status(response.isError ? 400 : 200).send(response);
});

/**
 * @typedef GetCompletedOrdersRequest
 */
/**
 * @typedef GetCompletedOrdersResponse
 * @property {Array.<Order>} Order
 */
router.get('/completedOrders', adminAuth, async(req, res) => {
    const response = await auth.completedOrders();
    return res.status(response.isError ? 400 : 200).send(response);
});

// PATCH

/**
 * @typedef PatchToAttendedOrdersRequest
 * @property {string} orderId.required
 */
/**
 * @typedef PatchToAttendedOrdersResponse
 * @property {Order.model} orders
 */
router.patch('/orderAttended', adminAuth, async(req, res) => {
    const response = await auth.orderAttended(req.body.orderId);
    return res.status(response.isError ? 400 : 200).send(response);
});

/**
 * @typedef PatchToCompletedOrdersRequest
 * @property {string} orderId.required
 */
/**
 * @typedef PatchToCompletedOrdersResponse
 * @property {Order.model} orders
 */
router.patch('/orderCompleted', adminAuth, async(req, res) => {
    const response = await auth.updateStatus(req.body.orderId);
    return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;