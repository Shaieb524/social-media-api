import { Document } from "mongoose";

export interface INft extends Document {
    address: string;
    tokenId: string;
    owner: string;
    tags: {
        type : [],
        default: [],
    },
}