const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
    ],
},
{
  timestamps: true
});

UserSchema.methods.getDisplayName = function getDisplayName() {
    return this.firstName || this.username || '';
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);