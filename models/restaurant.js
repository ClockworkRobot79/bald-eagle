const mongoose = require('mongoose');

// schema setup
const restaurantSchema = new mongoose.Schema({
    name: String,
    description: String,
    website: String,
    location: {
        address: String,
        lat: Number,
        long: Number,
    },
    menuItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem"
         }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
         }
    ],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
