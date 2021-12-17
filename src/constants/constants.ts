import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const MANDRILL_KEY = process.env.MANDRILL_KEY;

import NewsfeedController from '../controllers/newsfeed'
import { NewsfeedServices } from "../services/newsfeed"
import { NewsfeedModel } from "../models/newsfeed"

import NftController from '../controllers/nft'
import { NftServices } from "../services/nft"
import { NFTModel } from "../models/nft"

import UsersController from '../controllers/users'
import { UsersServices } from "../services/users"
import { UsersModel } from "../models/users"


export const MODELS_PACKAGE = [
    {
        apiPath: 'newsfeed',
        modelController: new NewsfeedController(new NewsfeedServices(NewsfeedModel)),
    },
    {
        apiPath: 'nfts',
        modelController: new NftController(new NftServices(NFTModel)),
    },
    {
        apiPath: 'users',
        modelController: new UsersController(new UsersServices(UsersModel))
    }
]