// load our envars
require('dotenv-safe').config(); 

// load dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errorHandler } = require('./utils/errorHandling');
const { loginRequired, ensureCorrectUser } = require("./services/auth/authMiddleware");
const db = require("./models")

const app = express();
const port = process.env.PORT || 8080; 

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(errorHandler);

// middlewares routes
const authRouter = require('./routes/auth');
const messagesRouter = require('./routes/message'); 

app.use('/api/auth', authRouter);
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messagesRouter);

app.get("/api/messages", loginRequired, async function(req,res,next){
    try {
        let messages = await db.Message.find()
        .sort({createdAt: "desc"})
        .populate("user", {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(messages);
    } catch(err) {
        return next(err);
    }
});

// catch 404 and forward to error handler
app.use(function(req,res,next){
    //Error it's a built in function in js
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// start server
app.listen(port, () => {console.log(`Server started on port ${port}`)});