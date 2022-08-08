import { model, Schema } from 'mongoose'
import { INft } from '../interfaces/nft'

const NFTSchema = new Schema({
    address :{
        type: String,
    },
    tokenId:{
        type: String,
    },
    owner: {
        type: String,
    },
    tags: {
        type : Array,
        default: [],
    },
})

export const NFTModel = model<INft>("NFTs", NFTSchema);