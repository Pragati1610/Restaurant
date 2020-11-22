const Auth = require('../models/auth');
const Orders = require('../models/orders');
const logger = require('../logging/logger');

/**
 * Class to handle all operations related to Auth
 */

class AuthController {

    /**
     * This function creates an admin ~ will be deleted after creating the admin
     * @route POST /auth/signup
     * @group Admin
     * @param {AdminSignupRequest.model} admin.body.required
     * @returns {Admin.model} 200 - An object of admin info
     * @returns {Error}  default - Unexpected error
     */

    static async createAuth(auth) {
        try {
            const createdAuth = await Auth.create(auth);
            return {
                message: 'Auth created',
                createdAuth
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function logs in the admin
     * @route POST /auth/login
     * @group Admin
     * @param {AdminLoginRequest.model} admin.body.required
     * @returns {Admin.model} 200 - An object of admin info
     * @returns {Error}  default - Unexpected error
     */

    static async getAuthByAuthName(authName) {
        try {
            const auth = await Auth.findOne({ authName: authName }).exec();
            return auth;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function gets all orders of the restaurant
     * @route GET /auth/allOrders
     * @group [Auth] ToDo
     * @security JWT
     * @returns {Array.<Order>} 200 - An array of orders
     * @returns {Error}  default - Unexpected error
     */

    static async getAllOrders() {
        try {
            const orders = await Orders.find({});
            return orders;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function gets attended(food delivered) orders of the restaurant
     * @route GET /auth/attendedOrders
     * @group [Auth] ToDo
     * @security JWT
     * @returns {Array.<Order>} 200 - An array of attended orders
     * @returns {Error}  default - Unexpected error
     */

    static async attendedOrders() {
        try {
            const orders = await Orders.find({ status: "attended" });
            return orders;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function gets completed(bill paid) orders of the restaurant
     * @route GET /auth/completedOrders
     * @group [Auth] ToDo
     * @security JWT
     * @returns {Array.<Order>} 200 - An array of completed orders
     * @returns {Error}  default - Unexpected error
     */

    static async completedOrders() {
        try {
            const orders = await Orders.find({ status: "completed" });
            return orders;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function updates and order of the restaurant which was attended to 
     * @route PATCH /auth/orderAttended
     * @group [Auth] ToDo
     * @security JWT
     * @property {string} orderId.body.required
     * @returns {Order.model} 200 - An object of type Order
     * @returns {Error}  default - Unexpected error
     */

    static async orderAttended(orderId) {
        try {
            const order = await Orders.findOneAndUpdate({ _id: orderId }, { status: "attended" }, { new: true });
            return order;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            }
        }
    }

    /**
     * This function updates and order of the restaurant which was paid and thus completed 
     * @route PATCH /auth/orderCompleted
     * @group [Auth] ToDo
     * @security JWT
     * @property {string} orderId.body.required
     * @returns {Order.model} 200 - An object of type Order
     * @returns {Error}  default - Unexpected error
     */


    static async updateStatus(orderId) {
        try {
            const order = await Orders.findByIdAndUpdate({ _id: orderId }, { status: "complete" }, { new: true });
            return order;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            }
        }
    }
}

module.exports = AuthController;