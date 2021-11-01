const router = require("express").Router();
const User = require('../models/Users');
const NFT = require('../models/NFT')
const Newsfeed = require('../models/Newsfeed')
const logger = require("../utils/logger")
const superheroes = require('superheroes');
const { profile } = require("../utils/logger");

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
        res.status(404).json('incorrect referral link')
       }
       
   }
    try {
        const username = superheroes.random()
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
        logger.error(error)
    }
})
router.get('/walletConnect/:referralLink?', async(req,res)=>{
    res.send("wallet connection page")
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
router.get('/:username', async (req,res)=>{
    try{
        const username = req.params.username.toLowerCase()
        const user = await User.findOne({username : { $regex : new RegExp(username, "i")} });
        res.status(200).json(user)
    }
    catch(error){
        res.status(500).json(error);
        logger.error(error)
    }
})
//search via Username
router.post('/search', async (req,res)=>{
    try {
        const user = await User.find({$or: [{'username': {$regex: req.body.username, $options: 'i'}},
                                            {'walletAddress': {$regex: req.body.username, $options: 'i'}}] })
        if(user.length=="0"){
               res.status(404).json("user not found")
        }
        else{
            res.status(200).json(user)
        }
    } catch (error) {
        logger.error(error)
    }
})

//Tag NFTs
router.post('/NFTtag', async(req,res)=>{
    try{
        const user = await User.findOne({walletAddress: req.body.owner})
        if(!user){
            res.status(404).json('user does not exists')
        }
        else{
            const newNFT  = await new NFT({
                owner: req.body.owner,
            })    
            const nft = await newNFT.save();
        await nft.updateOne( {$set: req.body},)
        const uNFT = await NFT.find({owner:req.body.owner })
        await user.updateOne({NFTs: uNFT})
        res.status(200).json("NFT added")
    }
}
    catch(error){
        console.log(error)
    }
})

//Search via NFT tags
router.get('/NFTsearch/:tag', async(req,res)=>{
    try{
        const nfts = await NFT.find({tags: {"$in": [req.params.tag]}}) 
        if(nfts){
        res.status(200).json(nfts)
        }
    }
    catch(error){
        console.log(error)
    }
})

//Return tagged NFTs of an owner
router.get('/TaggedNFTs/:owner', async(req,res)=>{
    const owner = req.params.owner
    const user = await User.findOne({walletAddress:owner})
    
    const tagged = user.NFTs.filter((t)=>{
        if(t.tags.length !== 0){
            return t.tags
        }
    })
    res.status(200).json(tagged)
})

//Newsfeed
router.post('/newsfeed', async(req,res)=>{
    try{
        const user = await User.findOne({walletAddress:req.body.userAddress})
        if(!user){
            res.status(404).json('user does not exists')
        }
        else{
            const newNewsfeed  = await new Newsfeed({
                userAddress: req.body.userAddress,
                transactionHash: req.body.transactionHash,
                description: req.body.description
            })    
            const newsfeed = await newNewsfeed.save();
        await user.updateOne({$push:{Newsfeed: newsfeed}})
        res.status(200).json("Newsfeed added")
    }
    }
    catch(error){
        console.log(error)
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