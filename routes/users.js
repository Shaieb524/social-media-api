const router = require("express").Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken");
const randomstring = require("randomstring");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger")
const superheroes = require('superheroes');
const multer = require('multer');
const { profile } = require("../utils/logger");
const upload = multer({dest: 'uploads/'})

router.get('/',(req,res)=>{
    res.send("users Page")
})

//WalletConnect
router.post("/walletConnect/:ref?",async (req,res)=>{
    const ref = req.query.ref
   if(ref){
       const rUser = await User.findOne({username:ref})
       if(rUser){
        rUser.referralCount=rUser.referralCount+1;
        await rUser.save();
       }
       else{
        res.status(400).json('incorrect referral link')
       }
       
   }
    try {
        const username = superheroes.random();
       // create new user
       const eUser = await User.findOne({walletAddress:req.body.walletAddress})
       if(!eUser){
        const newUser  = await new User({
            walletAddress: req.body.walletAddress,
            isWalletConnected: true,
            username: username.replace(/\s/g, ""),
       })
       //save user
        const user = await newUser.save();
        
        res.status(200).json(user)
        logger.info("Wallet connection successful")
    }
    else{
        res.status(200).json(eUser)
    }
    } catch (error) {
        console.log(error)
    }
})
router.get('/walletConnect/:referralLink?', async(req,res)=>{
    res.send("wallet connection page")
})

//login
router.post("/login", async (req,res)=>{
    try {
        const user = await User.findOne({walletAddress : req.body.walletAddress})
        !user && res.status(400).json('user not found')

        // const validPassword = await bcrypt.compare(req.body.password, user.password)
        // !validPassword && res.status(400).json('wrong password')
        logger.info("login successful")
        res.status(200).json(user)
    } catch (error) {
        logger.error(error)
    }
})
router.get("/login", async(req,res)=>{
    res.send("login page")
})

// router.put('/profile/:id', upload.single('profilePic'), async (req,res)=>{
//     if(req.body.userId === req.params.id){
//         try{
//             console.log(req.file.path)
//             const user = await User.findByIdAndUpdate(req.params.id, {
//                 profilePic: req.file.path,
//                 email : req.body.email,
//                 username: req.body.username,
                
//             })
//             console.log(req.file.path)

//             res.status(200).json("Account Updated")
//             logger.info("Account Updated")
//         }
//         catch(error){
//            console.log(error)
//         }
//     }
// })

//Update User
router.put('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account Updated")
            logger.info("Account Updated")
        }
        catch(error){
           logger.error(error)
        }
    }
})
// router.get('/:id', async(req,res)=>{
//     res.send("update")
//})
//delete User
router.delete('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account Deleted")
            logger.info("Account Deleted")

        }
        catch(error){
           logger.error(error)

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
        logger.error(error)
    }
})

// // refer
// router.post("/refer", async(req,res)=>{
//     try {
//         const rEmail = req.body.rEmail;
//         await sendEmail(rEmail, "referral", "Dummy referral template");
//         res.send(`referral link sent to your email account ${rEmail}`);
//         logger.info(`referral link sent to your email account ${rEmail}`)

//     } catch (error) {
//         res.send("An error occured");
//         logger.error(error);
//     }
// })
module.exports = router;