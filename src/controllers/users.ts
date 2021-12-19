import { Request, Response, Router } from "express";
import MainController from './main'
import { UsersServices } from '../services/users'
import { UsersModel } from '../models/users'
import ErrorValidator from '../utils/error-validator'
import superheroes from 'superheroes'

class UsersController extends MainController {
    
    constructor(private usersService: UsersServices) {
        super(usersService)
        this.setRoutes()
    }

    setRoutes() {
        super.setRoutes()
        this.router.route("/:username").get(this.findUserByName);
        this.router.route("/search").post(this.searchUsers);
        this.router.route("/walletConnect/:ref?").post(this.walletConnect);
        this.router.route("/TaggedNFTs/:owner").post(this.getTaggedNftsForUser);
    }

    private findUserByName = async (req: Request, res: Response) => {
        try {
            const username = req.params.username.toLowerCase()
            const user = await UsersModel.findOne({username : { $regex : new RegExp(username, "i")} });
            res.status(ErrorValidator.SUCCESS).send(user)
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
            res.status(ErrorValidator.SUCCESS).send(user)
        } catch (e) {
            e instanceof Error
                ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
                : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getting items"));
        }
    }

    private walletConnect = async (req: Request, res: Response) => {
        try {

            if (req.query.ref) {
                const ref = req.query.ref;
                const rUser = await UsersModel.findOne({ username: ref });
                if (rUser) {
                    rUser.referralCount = rUser.referralCount + 1;
                    await rUser.save();
                } else {
                    res.status(404).json("incorrect referral link");
                }
            }

            const existedUser = await UsersModel.findOne({ walletAddress: req.body.walletAddress });
            if (!existedUser) {
                const assignedUsername = superheroes.random();
                const createdUserData = {
                    walletAddress: req.body.walletAddress,
                    isWalletConnected: true,
                    username: assignedUsername.replace(/\s/g, ""),
                }

                const addedUser = await this.usersService.addItem(createdUserData)
                res.status(ErrorValidator.SUCCESS).json(addedUser);
            } else {
                res.status(ErrorValidator.SUCCESS).json(existedUser);
            }
        } catch (e) {
            e instanceof Error
                ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
                : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while connecting wallet!"));
        }
    }

    private getTaggedNftsForUser = async (req: Request, res: Response) => {
        try {
            const owner = req.params.owner
            const user = await UsersModel.findOne({ walletAddress : owner });
            
            if (user) {
                // const taggedNfts = user.NFTs.filter((nft)=>{
                //     if(nft.tags.length !== 0){
                //         return nft.tags
                //     }
                // })

                res.status(ErrorValidator.SUCCESS).json(user.NFTs)
            } else {
                res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound(`User ${owner} was not found!`))
            }
 
        } catch (e) {
            e instanceof Error
            ? res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(e.message))
            : res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError("Unkown Error happened while getting items"));
        }
    }
}

export default UsersController