import { MainServices } from "./main";

export class UsersServices extends MainServices {
    constructor(usersModel : any) {
        super(usersModel)
    }

    public async followUser(callerId: string, targetId: string) {
        let callerUser:any = await this.serivceModel.findById({_id: callerId})
        let targetUser:any = await this.serivceModel.findById({_id: targetId})
        let insertFollowerProblem : boolean = false
        let followActionResult = {}

        if (!callerUser || !targetUser) {
            followActionResult = {code : 400, message: 'Problems with usres IDs'}
        } else {
            callerUser.followings.includes(targetUser.username) ? insertFollowerProblem = true : callerUser.followings.push(targetUser.username)
            targetUser.followers.includes(targetUser.username) ? insertFollowerProblem = true : targetUser.followers.push(callerUser.username)
       
            if (insertFollowerProblem) {
                followActionResult = {code: 400, message: 'Follow action already exists!'}
            } else {
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

        if (!callerUser || !targetUser) {
            return 400
        } else {


            let callerFollowingsItemIndex = callerUser.followings.indexOf(targetUser.username)
            let targetFollowesItemIndex = targetUser.followers.indexOf(callerUser.username)

            if (callerFollowingsItemIndex > -1) callerUser.followings.splice(callerFollowingsItemIndex, 1)
            if (targetFollowesItemIndex > -1) targetUser.followers.splice(targetFollowesItemIndex, 1)

            this.updateItem(callerId, callerUser)
            this.updateItem(targetId, targetUser)
            return 200
        }
    }

}