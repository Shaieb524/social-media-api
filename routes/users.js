const router = require("express").Router();
const User = require('../models/Users');
// const Token = require("../models/Tokens");
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken");
const randomstring = require("randomstring");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger")
const superheroes = require('superheroes');

router.get('/',(req,res)=>{
    res.send("users Page")
})

//WalletConnect
router.post("/walletConnect/:referralLink?",async (req,res)=>{
   const referralLink = req.params.referralLink;
   if(referralLink){
       const rUser = await User.findOne({referralLink:referralLink})
       !rUser && res.status(400).json('incorrect referral link')
       rUser.referralCount=rUser.referralCount+1;
       await rUser.save();
    
   }
    try {
       // create new user
        const newUser  = await new User({
            walletAddress: req.body.walletAddress,
            isWalletConnected: true,
            username: superheroes.random(),
            referralLink: randomstring.generate({
                length: 10,
                charset: 'alphabetic'
              }),
       })
       //save user
        const user = await newUser.save();
        
        res.status(200).json(user)
        logger.info("Wallet connection successful")
    } catch (error) {
        logger.error(error.message)
    }
})
router.get("/walletConnect/referralLink?", async(req,res)=>{
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
router.get('/:id', async(req,res)=>{
    res.send("update")
})
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

// // password reset request
// router.post('/requestResetPassword', async(req,res)=>{
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user)
//             return res.status(400).send("user with given email doesn't exist");

//         let token = await Token.findOne({ userId: user._id });
//         if (!token) {
//             token = await new Token({
//                 userId: user._id,
//                 token: crypto.randomBytes(32).toString("hex"),
//             }).save();
//         }

//         const link = `https://originalsapi.herokuapp.com/password-reset/${user._id}/${token.token}`;
//         await sendEmail(user.email, "Password reset", link);

//         res.send("password reset link sent to your email account");
//         logger.info("password reset link sent")
//     } catch (error) {
//         res.send("An error occured");
//         logger.error(error);
//     }
// })
// router.get("/requestResetPassword", async(req,res)=>{
//     res.send("Password reset page")
// })

// // password reset
// router.post("/:userId/:token", async(req,res)=>{
//     try {
//         const user = await User.findById(req.params.userId);
//         if (!user) return res.status(400).send("invalid link or expired");

//         const token = await Token.findOne({
//             userId: user._id,
//             token: req.params.token,
//         });
//         if (!token) return res.status(400).send("Invalid link or expired");
        
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
         
//         user.password = hashedPassword;
//         await user.save();
//         await token.delete();

//         res.send("password reset sucessfully.");
//         logger.info("password reset sucessfully.")

//     } catch (error) {
//         res.send("An error occured");
//         logger.error(error);
//     }
// })

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