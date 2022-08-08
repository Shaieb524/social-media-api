
import { INewsfeed } from '../interfaces/newsfeed'
import { INft } from '../interfaces/nft'
import { IUsers } from '../interfaces/users'

export class MainServices {
    public serivceModel

    constructor(serivceModel: any) {
        this.serivceModel = serivceModel
    }

    public findAll(): Promise<INewsfeed[] | INft[] | IUsers[]> {
        return this.serivceModel.find({}).exec()
    }

    public getRandom(randomNo : number): Promise<INewsfeed[] | INft[] | IUsers[]> {
        return this.serivceModel.aggregate([{$sample: {size : randomNo}}]).exec()
    }

    public addItem(request: any): Promise<INewsfeed | INft | IUsers> {
        const newItem = new this.serivceModel(request)
        return newItem.save()
    }

    public async deleteItem(id: string) {
        const deletedItem = await this.serivceModel.findByIdAndDelete(id).exec()
        if (!deletedItem) throw new Error(`error deleting item with id ${id}!`)

        return deletedItem
    }

    public async updateItem(id: string, reqItem: INewsfeed | INft | IUsers ) {
        const updatedItem = await this.serivceModel.findByIdAndUpdate(id, reqItem).exec()
        if (!updatedItem) throw new Error(`error updating item with id ${id}!`)

        return await this.serivceModel.findById(id);
    }

}