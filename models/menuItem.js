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
},
{
  timestamps: true
});
 
module.exports = mongoose.model("MenuItem", menuItemSchema);
