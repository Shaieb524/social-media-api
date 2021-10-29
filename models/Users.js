const mongoose = require('mongoose');
const Schema = mongoose.Schema
const NFTs = require('./NFT').schema
const UserSchema = new Schema({
    username :{
        type: String,
    },
    displayName:{
        type: String,
    },
    isWalletConnected: {
        type: Boolean,
        default: false,
    },
    walletAddress :{
        type: String,
        unique: true,
    },
    email :{
        type: String,
    },
    profilePic : {
        type: String,
    },
    backgroundPic :{
        type: String,
    },
    posts: {
        type : Array,
        default: [],
    },
    followers : {
        type: Array,
        default: [],
    },
    followings : {
        type: Array,
        default: [],
    },
    description:{
        type: String,
    },
    linkedURL:{
        type: Array,
        default: [],
    },
    // referralLink: {
    //     type: String,
    //     unique: true,
    // },
    referralCount:{
        type: Number,
        default: 0,
    },
    NFTs:[NFTs]
})

module.exports = mongoose.model('Users', UserSchema);