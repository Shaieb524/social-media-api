import { Request, Response, Router } from "express";
import MainController from './main'
import { NewsfeedServices } from '../services/newsfeed'
import { NewsfeedModel } from '../models/newsfeed'
import { INewsfeed } from '../interfaces/newsfeed'
import { UsersModel } from '../models/users'
import ErrorValidator from '../utils/error-validator'

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
            e instanceof Error
               ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
               : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getting items"));
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
            e instanceof Error
                ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
                : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getNewsfeedByUserName"));
        }
    }

}

export default NewsfeedController