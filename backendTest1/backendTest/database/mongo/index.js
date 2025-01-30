const mongoose = require('mongoose');


const dotenv = require('dotenv').config();

const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('DB Connected Successfully');
    }).catch((err)=>{
            console.log(`Error Connecting to DB: ` + err);
    })
}

module.exports.DATA_BASE = {connectDatabase};



