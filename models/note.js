const mongoose = require('mongoose');

// schema setup
const noteSchema = new mongoose.Schema({
    body: String,
	about: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'aboutModel',
    },
    aboutModel: {
        type: String,
        required: true,
        enum: ['Restaurant', 'MenuItem']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
},
{
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
