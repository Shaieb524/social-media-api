import { Document } from "mongoose";
import {INewsfeed} from './newsfeed'
import {INft} from './nft'

export interface IUsers extends Document {
  username: string;
  displayName: string;
  isWalletConnected: boolean;
  walletAddress: string;
  email: string;
  profilePic: string;
  backgroundPic: boolean;
  description: string;
  posts: Array<[]>
  followers: Array<[]>;
  followings: Array<[]>;
  linkedURL: Array<[string]>;
  referralCount: number;
//   Newsfeed: Array[];
//   NFTs: Array[INft];
}