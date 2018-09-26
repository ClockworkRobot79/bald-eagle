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

UserSchema.methods.getDisplayName = function getDisplayName() {
    let displayName = '';
    if (this.firstName) {
        displayName = this.firstName;
        if (this.lastName) {
            displayName += ' ' + this.lastName;
        }
    } else {
        displayName = this.username;
    }
    return displayName;
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);