import { MainServices } from "./main";

export class UsersServices extends MainServices {
    constructor(usersModel : any) {
        super(usersModel)
    }

    public async followUser(callerId: string, targetId: string) {
        let callerUser:any = await this.serivceModel.findById({_id: callerId})
        let targetUser:any = await this.serivceModel.findById({_id: targetId})
        let followActionResult: object = {}

        if (!callerUser || !targetUser) {
            followActionResult = {code : 400, message: 'Problems with usres IDs'}
        } else {
            if (callerUser.followings.includes(targetUser.username) || targetUser.followers.includes(targetUser.username)) {
                followActionResult = {code: 400, message: 'Follow action already exists!'}
            } else {
                callerUser.followings.push(targetUser.username)
                targetUser.followers.push(callerUser.username)
                this.updateItem(callerId, callerUser)
                this.updateItem(targetId, targetUser)
                followActionResult = {code : 200, message: 'Follow action was done successfully!'}
            }
        }
        return followActionResult
    }

    public async unfollowUser(callerId: string, targetId: string) {
        let callerUser:any = await this.serivceModel.findById({_id: callerId})
        let targetUser:any = await this.serivceModel.findById({_id: targetId})
        let unfollowActionResult: object = {}

        if (!callerUser || !targetUser) {
            unfollowActionResult = {code : 400, message: 'Problems with usres IDs'}
        } else {
            let callerFollowingsItemIndex = callerUser.followings.indexOf(targetUser.username)
            let targetFollowesItemIndex = targetUser.followers.indexOf(callerUser.username)
            
            if (callerFollowingsItemIndex == -1 || targetFollowesItemIndex == -1) {
                unfollowActionResult = {code: 400, message: 'Unfollow action problem!'}
            } else {
                callerUser.followings.splice(callerFollowingsItemIndex, 1)
                targetUser.followers.splice(targetFollowesItemIndex, 1)
                this.updateItem(callerId, callerUser)
                this.updateItem(targetId, targetUser)
                unfollowActionResult = {code : 200, message: 'Unfollow action was done successfully!'}
            }
        }
        return unfollowActionResult
    }

}