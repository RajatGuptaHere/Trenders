const mongoose = require('mongoose');

const DB = process.env.MONGODB_URI;
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})