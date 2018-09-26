const mongoose = require('mongoose');

// schema setup
const recommendationSchema = new mongoose.Schema({
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    from: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
},
{
  timestamps: true
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
