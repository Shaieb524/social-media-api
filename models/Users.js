const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username :{
        type: String,
        unique: true,
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
        type: Array,
        default: [],
    },
})

module.exports = mongoose.model('Users', UserSchema);