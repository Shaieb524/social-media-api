import { model, Schema } from 'mongoose'
import { IUsers } from '../interfaces/users'

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
    referralCount:{
        type: Number,
        default: 0,
    },
})

export const UsersModel = model<IUsers>('Users', UserSchema);