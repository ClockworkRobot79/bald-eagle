var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});
 
module.exports = mongoose.model("Comment", commentSchema);
