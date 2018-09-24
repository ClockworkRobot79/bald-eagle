const mongoose = require('mongoose');

// schema setup
const listSchema = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    elements: [{
        kind: String, // Restaurant or MenuItem
        item: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'elements.kind'
        },
    }]
},
{
  timestamps: true
});

module.exports = mongoose.model('List', listSchema);
