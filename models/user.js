const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

// Adding a hook, for saving the password correctly
userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10); // salting the passsword
        this.password = hashedPassword;
        return next(); // it's going to move on the next piece of middleware, which is "saving"
    } catch (err) {
        return next(err);
    }
});

// Instance method, a method that every document that we create from this model has
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
}

// create a model
const User = mongoose.model("User", userSchema);

module.exports = User;