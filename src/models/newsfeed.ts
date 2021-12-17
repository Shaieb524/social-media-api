import { model, Schema } from 'mongoose'
import { INewsfeed } from '../interfaces/newsfeed'

const NewsfeedSchema = new Schema({
    username :{
        type: String,
    },
    transactionHash:{
        type: String,
    },
    description: {
        type: String,
    }
})

export const NewsfeedModel = model<INewsfeed>("Newsfeed", NewsfeedSchema);