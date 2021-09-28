const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const userRoute = require('./routes/users')
dotenv.config();
const logger = require("./utils/logger")
const start = async () => {
    
    if (!process.env.MONGO_URL) {
        throw new Error('auth MONGO_URL must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false, 
        });
        console.log('Server connected to MongoDb !');
    } catch (err) {
        logger.error(err);
    }
    //  mongoose.set('debug', true)


app.use(express.json());
// app.use('/uploads')
app.use(helmet());
app.use(cors())

app.get("/", (req,res)=>{
    res.send("success")
    logger.info("Health Check Successful");
})

app.use('/users',userRoute)

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port 3000");
  });
  
};
start();
