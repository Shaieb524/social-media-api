const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users')

dotenv.config();
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
        console.error(err);
    }

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.get("/health-check", (req,res)=>{
    res.send("success")
})

app.use('/users',userRoute)

app.listen(3000, () => {
    console.log('Server is listening on 3000')
});
};
start();
