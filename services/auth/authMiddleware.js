require('dotenv-safe').config(); // we bring the envars, and make sure are loaded
const jwt = require('jsonwebtoken');


// make sure the user is logged - Authentication
exports.loginRequired = function(req,res,next) {
    try {
         // On the headers we get: Bearer tokenxywh
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(decoded) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: "Please log in first"
                })
            }
        });
    } catch(e) {
        return next({
            status: 401,
            message: "Please log in first"
        });
    }
};


// make sure we get the correct user - Authorization
// /api/users/:id/messages
exports.ensureCorrectUser = function(req,res,next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            // compare id on payload and id on params
            if(decoded && decoded.id === req.params.id) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: "Unauthorized"
                });
            }
        })
    } catch(e) {
        return next({
            status: 401,
            message: "Unauthorized"
        });
    }
}