// Connect to the db, set debug and make sure we use promises
const mongoose = require("mongoose");
mongoose.set("debug", true); // so we can see mongo queries on the terminal
mongoose.Promise = Promise; // ES2015. Make sure our mongoose methods return promises
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/warbler", {
    keepAlive: true,
    useNewUrlParser: true
});

// by exporting together the message model is able to be accessed by the uer
module.exports.User = require("./user");
module.exports.Message = require("./message");