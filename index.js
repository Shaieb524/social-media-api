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

app.get("/", (req,res)=>{
    res.send("success")
})

app.use('/users',userRoute)

// app.listen(8080, () => {
//     console.log('Server is listening on 8080')
// });
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  
};
start();
