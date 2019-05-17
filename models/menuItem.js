const mongoose = require("mongoose");

const categories = [
    'Appetizer',
    'Side',
    'Entree',
    'Dessert',
    'Beverage',
    'Other',
];
 
var menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: {
        type: String,
        enum: categories,
        default: categories[categories.length - 1],
    },
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
 
menuItemSchema.statics.getCategories = () => categories;

module.exports = mongoose.model("MenuItem", menuItemSchema);
