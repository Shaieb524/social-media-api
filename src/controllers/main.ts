import { Request, Response, Router } from "express";
import ErrorValidator from '../utils/error-validator'
import GeneralHelper from '../utils/general-helper'

export default class MainController {
    public router = Router()
    public service
    
    constructor(service : any) {
        this.service = service
    }

    public setRoutes() {
        this.router.route("/get-all").get(this.findAllItems);
        this.router.route("/get-random").get(this.getRandomItems);
        this.router.route("/add-item").post(this.addItem);
        this.router.route("/:id").delete(this.deleteItem).put(this.updateItem);
    }

    protected findAllItems = async (_: Request, res: Response) => {
        try {
            const items = await this.service.findAll()
            res.status(ErrorValidator.SUCCESS).send(items)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting all items', res)
        }
    }

    private getRandomItems = async (req: Request, res: Response) => {
        try {
            const items = await this.service.getRandom(req.body.itemsNo)
            res.status(ErrorValidator.SUCCESS).send(items)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting random items', res)
        }
    }

    protected addItem = async (req: Request, res: Response) => {
        try {
            const item = await this.service.addItem(req.body)
            res.status(ErrorValidator.SUCCESS).send(item)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting adding item', res)
        }
    }

    protected deleteItem = async (req: Request, res: Response) => {
        try {
            const deletedItem = await this.service.deleteItem(req.params.id)
            res.status(ErrorValidator.SUCCESS).send(deletedItem)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting deleting item', res)
        }
    }

    protected updateItem = async (req: Request, res: Response) => {
        try {
            const updatedItem = await this.service.updateItem(req.params.id, req.body)
            res.status(ErrorValidator.SUCCESS).send(updatedItem)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting updating item', res)
        }
    }

}