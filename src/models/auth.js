const mongoose = require('mongoose');

/**
 * @typedef Admin
 * @property {string} authName.required
 * @property {string} password.required
 */

const authSchema = new mongoose.Schema({
    authName: {
        type: String,
        required: [true, 'Auth must have a name'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    }
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;