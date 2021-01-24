const jwt = require('jsonwebtoken');

var util = {};

util.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        return next();
    }

    catch (error) {
        return res.status(401).json({
            message: 'Token is not available'
        })
    }
}

module.exports = util;