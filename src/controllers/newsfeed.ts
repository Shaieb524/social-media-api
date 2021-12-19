import { Request, Response } from "express";
import MainController from './main'
import { NewsfeedServices } from '../services/newsfeed'
import { NewsfeedModel } from '../models/newsfeed'
import { INewsfeed } from '../interfaces/newsfeed'
import { UsersModel } from '../models/users'
import ErrorValidator from '../utils/error-validator'
import GeneralHelper from '../utils/general-helper'

class NewsfeedController extends MainController {

    constructor(private newsfeedService: NewsfeedServices) {
        super(newsfeedService)
        this.setRoutes()
    }

    setRoutes() {
        super.setRoutes()
        this.router.route("/create-post").post(this.createNewsfeedPostForUser);
        this.router.route("/:username").get(this.getNewsfeedByUserName);
    }

    private createNewsfeedPostForUser = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.findOne({username: req.body.username})
            if (!user) {
                res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound("user does not exists"))
            } else {
                const addedNewsfeed = await this.newsfeedService.addItem(req.body)
                await user.updateOne({ $push: { Newsfeed: addedNewsfeed } })
                res.status(ErrorValidator.SUCCESS).send(ErrorValidator.success())
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'creating newsfeed post', res)
        }
    }

    private getNewsfeedByUserName = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.findOne({username: req.params.username})
            if (user != null) {
                const followings = user.followings
                let newsFeed: INewsfeed[] = []

                for (let i=0; i<followings.length; i++) {
                    const news = await NewsfeedModel.find({username:followings[i]})
                    if (news.length !== 0) newsFeed = newsFeed.concat(news);
                }
                res.status(ErrorValidator.SUCCESS).json(newsFeed)
            } else {
                res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound("Requested user not found!"))
            }
            
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting newsfeed by name', res)
        }
    }

}

export default NewsfeedController