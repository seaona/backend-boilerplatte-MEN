const db = require("../../models"); // this is the same as ../models/index.js
const jwt = require("jsonwebtoken"); //to create JWT

exports.signin = async function(req,res,next) {
    // finding a user
    // checking if their pw matches
    // if it all matches
        // log them in (creating a jswon token and sending it back in the response)
    
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        let {id, username, profileImageUrl} = user;
        let isMatch = await user.comparePassword(req.body.password);
        if(isMatch) {
            let token = jwt.sign({
                id,
                username,
                profileImageUrl
            },
            process.env.SECRET_KEY 
            // inside our token, we sign it with our secret key
            // make sure we use the same secret key to sign and later to verify tokens
            );
            return res.status(200).json({
                id,
                username,
                profileImageUrl,
                token
            });
        } else {
            return next({
                // we pass to our error handler a status and message error
                status: 400,
                message: "Invalid Email/Password"
            });
        }
    } catch (e) {
        return next({status: 400, message: "Invalid Email/Password"})
    }
};

exports.signup = async function(req, res, next) {
    try {
        // create a user
        // create a token (signing a token)
        // process.env.SECRET_KEY
        let user = await db.User.create(req.body); //data cmining it from ajax request
        let { id, username, profileImageUrl } = user;
        let token = jwt.sign({
            id,
            username,
            profileImageUrl
        }, process.env.SECRET_KEY);
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
    } catch(err) {
        // see what kind of error
        // if it is a certain error
        // respond with username/mail already taken
        // otherwise send a generic 400
        if(err.code === 11000) {
            err.message = "Sorry, that username and/or email is taken";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}