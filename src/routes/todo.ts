import express, {Request, Response} from 'express'

const router = express.Router()

router.get('/api/todo', (req : Request, res : Response) => {
    return res.send("todo")
})

export {router as todoRouter}