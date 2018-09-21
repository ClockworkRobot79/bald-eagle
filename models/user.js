const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
    ],
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);