import { Request, Response } from "express";
import MainController from './main'
import { NftServices } from '../services/nft'
import ErrorValidator from '../utils/error-validator'
import GeneralHelper from '../utils/general-helper'
import { NFTModel } from '../models/nft'


class NftController extends MainController {
    
    constructor(private nftService: NftServices) {
        super(nftService)
        this.setRoutes()
    }

    setRoutes() {
        super.setRoutes()
        this.router.route("/get-token-tags").post(this.getTokenTags);
    }

    private getTokenTags = async (req: Request, res: Response) => {
        try {
            const token = await NFTModel.findOne({tokenId: req.body.tokenId})
            if (!token) {
                res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound("Token was not found!"))
            } else {
                res.status(ErrorValidator.SUCCESS).send(token)
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'creating newsfeed post', res)
        }
    }

}

export default NftController