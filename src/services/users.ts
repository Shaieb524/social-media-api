import { MainServices } from "./main";

export class UsersServices extends MainServices {
    constructor(usersModel : any) {
        super(usersModel)
    }

    public async followUser(callerId: string, targetId: string) {
        let callerUser:any = await this.serivceModel.findById({_id: callerId})
        let targetUser:any = await this.serivceModel.findById({_id: targetId})

        if (!callerUser || !targetUser) {
            return 400
        } else {
        	callerUser.followings.push(targetUser.username)
        	targetUser.followers.push(callerUser.username)  
            this.updateItem(callerId, callerUser)
            this.updateItem(targetId, targetUser)
            return 200
        }
    }

}