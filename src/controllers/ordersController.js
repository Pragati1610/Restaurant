const Orders = require('../models/orders');
const logger = require('../logging/logger');

/**
 * Class to handle all operations related to customer orders
 */

class OrdersController {

    /**
     * This function creates an order
     * @route POST /orders/
     * @group Orders
     * @param {CreateOrderRequest.model} order.body.required
     * @returns {CreateOrderResponse.model} 200 - An object of order info
     * @returns {Error}  default - Unexpected error
     */

    static async createOrder(order) {
        try {
            const isOrdered = await Orders.findOne({ customerName: order.customerName, customerContact: order.customerContact });
            if (isOrdered) {
                return {
                    message: "Order with that credentials already exists",
                    isOrdered
                };
            } else {
                if (order.customerContact.length == 10) {
                    const createdOrder = await Orders.create(order)
                    return {
                        message: 'order created',
                        createdOrder
                    };
                } else {
                    return {
                        message: 'Contact number is not of 10 digits'
                    }
                }

            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function gets an order
     * @route GET /orders
     * @group Orders
     * @security JWT
     * @property {GetYourOrderRequest.model} order
     * @returns {GetYourOrderResponse.model} 200 - An object of order info
     * @returns {Error}  default - Unexpected error
     */

    static async getOrder(customer) {
        try {
            const customerOrder = await Orders.find({ customerName: customer.customerName }).exec();
            return customerOrder;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    /**
     * This function updates an order
     * @route PATCH /orders/patchOrder
     * @group Orders
     * @security JWT
     * @param {PatchYourOrderRequest.model} order.body.required
     * @returns {PatchYourOrderResponse.model} 200 - An object of updated order info
     * @returns {Error}  default - Unexpected error
     */

    static async updateOrder(customer, order) {
        try {
            if (order.password || order.status) {
                return {
                    isError: true,
                    message: "you can't change the above parameters"
                }
            }
            const dateOrder = await Orders.findOne({ customerName: customer.customerName });
            console.log(order.deadLineTime);
            console.log(dateOrder.deadLineTime);
            if (dateOrder.deadLineTime > order.deadLineTime) {
                return {
                    isError: true,
                    message: "deadLineTime cannot be reduced"
                }
            }
            const customerOrder = await Orders.findOneAndUpdate({ customerName: customer.customerName }, order, { new: true }).exec();
            return {
                message: "order updated",
                customerOrder
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
     * This function updates an order
     * @route DELETE /orders/cancelOrder
     * @group Orders
     * @security JWT
     * @returns {DeleteYourOrderResponse.model} 200 - An object of updated order info
     * @returns {Error}  default - Unexpected error
     */


    static async deleteOrder(customer) {
        try {
            const customerOrder = await Orders.deleteOne({ customerName: customer.customerName }).exec();
            return {
                message: "order deleted",
                customerOrder
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

}

module.exports = OrdersController;