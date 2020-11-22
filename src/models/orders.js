const mongoose = require('mongoose');

/**
 * @typedef Item
 * @property {string} itemName.required
 * @property {number} itemPrice.required
 * @property {number} quantity.required
 */

/**
 * @typedef Order
 * @property {string} customerName.required
 * @property {string} password.required
 * @property {number} customerContact.required
 * @property {Array.<Item>} items.required
 * @property {timestamps} deadLineTime
 * @property {string} status
 */

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Item must have a name']
    },
    itemPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const ordersSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer must have a name'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    },
    customerContact: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    order: {
        type: [itemSchema],
        minlength: 1
    },
    deadLineTime: {
        type: Date,
        required: true,
        default: () => Date.now() + 30 * 60 * 1000
    },
    status: {
        type: String,
        default: "pending" // "completed", "cancelled", "attended", "expired"
    }
}, {
    timestamps: true
});

const Items = mongoose.model('Items', itemSchema);
const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;