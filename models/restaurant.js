const mongoose = require('mongoose');
const MenuItem = require('./menuItem');

// schema setup
const restaurantSchema = new mongoose.Schema({
    name: String,
    description: String,
    website: String,
    phone: String,
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
},
{
  timestamps: true
});

restaurantSchema.methods.getCategories = function getCategories() {
    let categories = [];
    if (this.menuItems.length) {
        MenuItem.getCategories().forEach((category) => {
            const menuItems = this.menuItems.filter(menuItem => menuItem.category === category);
            if (menuItems.length) {
                categories.push({
                    label: category,
                    menuItems,
                });
            }
        });
    }
    return categories;
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
