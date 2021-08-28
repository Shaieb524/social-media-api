const router = require("express").Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt')
router.get('/',(req,res)=>{
    res.send("users Page")
})

//register
router.post("/register",async (req,res)=>{
   
    try {
        //generate hashedpassword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
         
       // create new user
        const newUser  = await new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
       })
       //save user
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
    }
})


//login
router.post("/login", async (req,res)=>{
    try {
        const user = await User.findOne({email : req.body.email})
        !user && res.status(400).json('user not found')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json('wrong password')
        console.log("login successful")
        res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
    }
})

//Update User
router.put('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        console.log("enter")
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account Updated")

        }
        catch(err){
           return res.status(500).json(err.message)
        }
    }
})
//delete User
router.delete('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account Deleted")

        }
        catch(err){
           return res.status(500).json(err.message)
        }
    }
})

//get user
router.get('/:id', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    }
    catch(error){
        res.status(500).json(error);
    }
})


module.exports = router;