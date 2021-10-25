const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
    address :{
        type: String,
    },
    owner :{
        type: String,
    },
    tags: {
        type : Array,
        default: [],
    },
})

module.exports = mongoose.model('NFTs', NFTSchema);