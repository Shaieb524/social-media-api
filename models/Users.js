const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username :{
        type: String,
        unique: true,
    },

    password:{
        type: String,
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
    }
})

module.exports = mongoose.model('Users', UserSchema);