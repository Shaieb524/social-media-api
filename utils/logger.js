const { createLogger, format, transports } = require('winston');
require('dotenv').config({path:'./.env'})
// Import mongodb
require('winston-mongodb');

module.exports = createLogger({

    transports:[
// File transport
        new transports.File({
            filename: 'logs/server.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )}),
        new transports.MongoDB({
            level: 'info',
            db: process.env.MONGO_URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'server_info_logs',
            format: format.combine(
                format.timestamp(),
                format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGO_URL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'server_error_logs',
            format: format.combine(
                format.timestamp(),
                format.json())
        })
    ]
});


// router.post('/NFTtag', async(req,res)=>{
//     try{
//         const user = await User.findOne({walletAddress: req.body.owner})
//         if(!user){
//             res.status(404).json('user does not exists')
//         }
//         else{
//             const newNFT  = await new NFT({
//                 owner: req.body.walletAddress,
//             })    
//             const nft = await newNFT.save();
//         await nft.updateOne( {$set: req.body},)
//         const uNFT = await NFT.find({owner:req.body.owner })
//         console.log(uNFT)
//         await user.update({NFts:uNFT})        
//         res.status(200).json("NFT added")
//     }
// }
//     catch(error){
//         console.log(error)
//     }
// })