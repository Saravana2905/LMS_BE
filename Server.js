const express = require('express')
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const courseRoute = require('./Routes/courseRoute');


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test route
app.get('/',(req,res)=>{
    res.send('<script>alert("Connected and working");</script>');
})
//Routes
app.use('/course',courseRoute)

//connection to mongodb
mongoose.
connect(process.env.MongoURI)
.then(() => {
    console.log('connected to MongoDB')
    app.listen(process.env.Port, ()=> {
        console.log(`Node API app is running on port ${process.env.Port}`)
        console.log(`http://localhost:${process.env.Port}`)
    });
}).catch((error) => {
    console.log(error)
})