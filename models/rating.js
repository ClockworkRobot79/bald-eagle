const mongoose = require('mongoose');

// schema setup
const ratingSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

module.exports = mongoose.model('Rating', ratingSchema);
