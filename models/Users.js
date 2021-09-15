const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username :{
        type: String,
        unique: true,
    },
    isWalletConnected: {
        type: bool,
        default: false,
    },
    walletAddress :{
        type: String,
        unique: true,
    },
    email :{
        type: String,
        unique: true,
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
        type: String,
    },
})

module.exports = mongoose.model('Users', UserSchema);