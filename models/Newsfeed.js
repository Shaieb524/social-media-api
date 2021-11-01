const mongoose = require('mongoose');

const NewsfeedSchema = new mongoose.Schema({
    userAddress :{
        type: String,
    },
    transactionHash:{
        type: String,
    },
    description: {
        type: String,
    }
})

module.exports = mongoose.model('Newsfeed', NewsfeedSchema);