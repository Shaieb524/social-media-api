import { Request, Response, Router } from "express";
import MainController from './main'
import { UsersServices } from '../services/users'
import { UsersModel } from '../models/users'
import ErrorValidator from '../utils/error-validator'

class UsersController extends MainController {
    
    constructor(private usersService: UsersServices) {
        super(usersService)
        this.setRoutes()
    }

    setRoutes() {
        super.setRoutes()
        this.router.route("/:username").get(this.findUserByName);
        this.router.route("/search").post(this.searchUsers);
    }

    private findUserByName = async (req: Request, res: Response) => {
        try {
            const username = req.params.username.toLowerCase()
            const user = await UsersModel.findOne({username : { $regex : new RegExp(username, "i")} });
            res.send(user)
        } catch (e) {
            e instanceof Error
               ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
               : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getting items"));
        }
    }

    private searchUsers = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.find({$or: [
                {'username': {$regex: req.body.search, $options: 'i'}},
                {'walletAddress': {$regex: req.body.search, $options: 'i'}}
            ] });
            res.send(user)
        } catch (e) {
            e instanceof Error
               ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
               : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getting items"));
        }
    }
}

export default UsersController