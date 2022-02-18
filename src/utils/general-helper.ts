import ErrorValidator from '../utils/error-validator'
import { Response } from "express";

export default class GeneralHelper {

    public static checkTryErrorTypeAndResponse(tryError: any, specificationMessage: string, res: Response) {
        if (tryError instanceof Error) 
            return res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(tryError.message))
        else 
            return res.status(ErrorValidator.INTERNAL_SERVER_ERROR).send(ErrorValidator.internalServerError(specificationMessage))
    }

    public static getItemFromArrayByPropertyVal = (arrayInput : any[], itemPropertyKey : string, itemPropertyValue : any) => {
        return arrayInput.filter((item : any) => item[`${itemPropertyKey}`] === itemPropertyValue)[0] 
    }

    public static removeItemFromArrayByPropertyValFilter = (arrayInput : any[], itemPropertyKey : string, itemPropertyValue : any) => {
        return arrayInput.filter((item : any) => item[`${itemPropertyKey}`] !== itemPropertyValue) 
    }

    public static removeItemFromArrayByPropertyValMap = (arrayInput : any[], itemPropertyKey : string, itemPropertyValue : any) => {
        let subtractedArray : any[] = []
        arrayInput.map((item : any) => item[`${itemPropertyKey}`] !== itemPropertyValue ? subtractedArray.push(item) : null)
        return subtractedArray
    }

    public static checkItemInArrayByPropertyValue = (arrayInput : any[], itemPropertyKey : string, itemPropertyValue : any) => {
        let itemToReturn : string | number | object = {}
        let found = false

        arrayInput.map((item : any) => {
            if (item[`${itemPropertyKey}`] === itemPropertyValue) {
                found = true
                itemToReturn = item
            }
        })

        if (found) {
            return itemToReturn
        } else {
            return false
        }
    }

    public static getRequiredDataFromArrayByVal = (arrayInput : any[], itemPropertyKey : string, itemPropertyValue : any) => {
        let outputArray : any[] = []
        console.log('array input : ', arrayInput)
        arrayInput.map((item : any) => {
            console.log('item[`${itemPropertyKey}`] : ', item[`${itemPropertyKey}`])
            if (item[`${itemPropertyKey}`] === itemPropertyValue) {
                outputArray.push(item)
            }
        })

        console.log('array output : ', outputArray)
        return outputArray
    }

    public static removeFieldFromObjectsArray = (arrayInput : any[], fieldToDelete : string) => {
        arrayInput.forEach((item : any) => {
            delete item[`${fieldToDelete}`]
        })

        return arrayInput
    }

    public static giveIncrementalIdToArrayObjects = (arrayInput: any[]) => {
        let itemId = 1
        arrayInput.map((item : any) => {
            item['incId'] = itemId
            itemId += 1
        }, arrayInput)

        return arrayInput
    }  
    
    public static removeItemFromArray = (arrayInput: any[], itemToRemove: any) => {
        return arrayInput.filter((item: any) => item != itemToRemove)
    }

    public static getDistinctValuesFromArray = (value: any, index: number, self: any[]) => self.indexOf(value) === index
}