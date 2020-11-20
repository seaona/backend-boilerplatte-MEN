const mongoose = require("mongoose");
const User = require("./user");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: 160
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    }
);

// importan: we don't want to delete a message and that the user still has the id of that message
messageSchema.pre("remove", async function(next){
    try {
        // find a user
        let user = await User.findById(this.user);
        // remove the id of the message from their messages list
        user.messages.remove(this.id);
        // save the user and return next, since its a hook (middleware) and we want to continue
        await user.save();
        return next(); 
    } catch(err) {
        return next(err);
    }
})

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;