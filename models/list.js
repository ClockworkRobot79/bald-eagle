const mongoose = require('mongoose');

// schema setup
const listSchema = new mongoose.Schema({
    name: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
},
{
  timestamps: true
});

module.exports = mongoose.model('List', listSchema);
