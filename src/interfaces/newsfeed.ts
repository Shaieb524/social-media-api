import { Document } from "mongoose";

export interface INewsfeed extends Document {
  username: string;
  transactionHash: string;
  description: string;
}