import { Request, Response } from "express";
import MainController from './main'
import { UsersServices } from '../services/users'
import { UsersModel } from '../models/users'
import { NftServices } from '../services/nft'
import { NFTModel } from '../models/nft'
import ErrorValidator from '../utils/error-validator'
import GeneralHelper from '../utils/general-helper'

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
        this.router.route("/NFTtag").post(this.tagUserNft);
        this.router.route("/NFTsearch/:tag").get(this.searchNftByTag);
        this.router.route("/TaggedNFTs/:owner").get(this.getTaggedNftsForUser);
        this.router.route("/follow").post(this.followUser);
        this.router.route("/unfollow").post(this.unfollowUser);
        this.router.route("/get-followers/:id").get(this.getUserFollowers);
        this.router.route("/get-followings/:id").get(this.getUserFollowings);
    }

    private findUserByName = async (req: Request, res: Response) => {
        try {
            const username = req.params.username.toLowerCase()
            const user = await UsersModel.findOne({username : { $regex : new RegExp(username, "i")} });
            res.status(ErrorValidator.SUCCESS).send(user)
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting items', res)
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
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'searching users', res)
        }
    }

    private walletConnect = async (req: Request, res: Response) => {
        try {

            if (req.query.ref) {
                const ref = req.query.ref;
                // const rUser = await UsersModel.findOne({ username: ref });
                // if (rUser) {
                //     rUser.referralCount = rUser.referralCount + 1;
                //     await rUser.save();
                // } else {
                //     res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound("incorrect referral link"));
                // }
            }

            const existedUser = await UsersModel.findOne({ walletAddress: req.body.walletAddress });
            if (!existedUser) {
                const assignedUsername = GeneralHelper.generateRandomUsername();
                const createdUserData = {
                    walletAddress: req.body.walletAddress,
                    isWalletConnected: true,
                    username: assignedUsername.replace(/\s/g, ""),
                }

                const addedUser = await this.usersService.addItem(createdUserData)
                res.status(ErrorValidator.SUCCESS).json(addedUser);
            } else {
                res.status(ErrorValidator.SUCCESS).json({message : 'User already exists!'});
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'connecting wallet', res)
        }
    }

    private tagUserNft = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.findOne({walletAddress: req.body.owner})
            if (!user) {
                res.status(ErrorValidator.NOT_FOUND).send(ErrorValidator.notFound("User does not exist!"))
            }
            else {
                let nftService = new NftServices(NFTModel)
                let {owner, tokenId, address, tags} = req.body

                // creaate nft
                await nftService.addItem({
                    owner: owner,
                    tokenId: tokenId,
                    address: address,
                    tags: tags
                })    

                // update user's nfts
                const uNFT = await NFTModel.find({ owner: req.body.owner })
                // await user.updateOne({NFTs: uNFT})

                res.status(ErrorValidator.SUCCESS).send(ErrorValidator.success('Nft added successfully!'))
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'tagging user NFT', res)
        }
    }

    private searchNftByTag = async (req: Request, res: Response) => {
        if (req.params.tag) {
            try {
                // const nfts = await NFTModel.find({tags: {"$in": [req.params.tag]}}) 
                // if (nfts) res.status(ErrorValidator.SUCCESS).json(nfts)
            } catch (e) {
                GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting NFT tag', res)
            }
        } else {
            res.status(ErrorValidator.BAD_REQUEST).send(ErrorValidator.badRequest("no nft tag in request"));
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
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting tagged NFTs', res)
        }
    }

    private followUser = async (req: Request, res: Response) => {
        try {
            let followUserAction = await this.service.followUser(req.body.callerId, req.body.targetId)
            if (followUserAction.code == 200) {
                res.status(ErrorValidator.SUCCESS).send({message : "Follwing done successfully!"})
            } else {
                res.status(ErrorValidator.BAD_REQUEST).send({message : followUserAction.message})
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'follwing user', res)
        }
    }

    private unfollowUser = async (req: Request, res: Response) => {
        try {
            let unfollowUserAction = await this.service.unfollowUser(req.body.callerId, req.body.targetId)
            if (unfollowUserAction.code == 200) {
                res.status(ErrorValidator.SUCCESS).send({message : "Unfollwing done successfully!"})
            } else {
                res.status(ErrorValidator.BAD_REQUEST).send({message : unfollowUserAction.message})
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'unfollwing user', res)
        }
    }

    private getUserFollowers = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.findOne({_id : req.params.id});
            if (user) {
                res.status(ErrorValidator.SUCCESS).send(user.followers)
            } else {
                res.status(ErrorValidator.NOT_FOUND).send({message : "User not found!"})
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting followers', res)
        }
    }

    private getUserFollowings = async (req: Request, res: Response) => {
        try {
            const user = await UsersModel.findOne({_id : req.params.id});
            if (user) {
                res.status(ErrorValidator.SUCCESS).send(user.followings)
            } else {
                res.status(ErrorValidator.NOT_FOUND).send({message : "User not found!"})
            }
        } catch (e) {
            GeneralHelper.checkTryErrorTypeAndResponse(e, 'getting followings', res)
        }
    }
}

export default UsersController