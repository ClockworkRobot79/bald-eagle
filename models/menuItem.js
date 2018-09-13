var mongoose = require("mongoose");
 
var menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
         }
    ],
});
 
module.exports = mongoose.model("MenuItem", menuItemSchema);
