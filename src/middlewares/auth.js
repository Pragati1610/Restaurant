const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');

const adminAuth = async(req, res, next) => {
    try {
        const token = req.get('Authorization');
        const user = jwt.verify(token, process.env.JWT_PASS);
        const admin = await Auth.findOne({ authName: user.authName });
        if (admin) {
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

module.exports = adminAuth;