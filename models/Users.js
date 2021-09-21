const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username :{
        type: String,
    },
    isWalletConnected: {
        type: Boolean,
        default: false,
    },
    walletAddress :{
        type: String,
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
    }
})

module.exports = mongoose.model('Users', UserSchema);