const mongoose = require('mongoose');

// schema setup
const ratingSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},
{
  timestamps: true
});

module.exports = mongoose.model('Rating', ratingSchema);
