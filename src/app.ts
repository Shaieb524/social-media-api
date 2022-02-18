import { Application, Request, Response } from "express";
import mongoose, { ConnectOptions } from 'mongoose'
import {MONGO_URL} from './constants/constants'
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MODELS_PACKAGE } from './constants/constants'
class App {
    public app: Application;

    constructor() {
        this.app = express()
        this.setConfig()
        this.setMongoConfig();
        this.setControllers()
    }

    private setConfig() {
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(cors());  
        this.app.get('/health-check', (_: Request, res: Response) => {
            res.status(200).send({message: 'Pongg!'})
        })     
    }

    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        mongoose.connect(`${MONGO_URL}`, {
            useNewUrlParser: true,
        } as ConnectOptions);
    }

    private setControllers() {
        MODELS_PACKAGE.forEach(modelItem => {
            const modelController = modelItem['modelController']
            this.app.use(`/${modelItem.apiPath}`, modelController.router)
        })
    }
}

export default new App().app