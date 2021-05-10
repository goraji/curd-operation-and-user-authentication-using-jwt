const mongoose = require('mongoose');
mongoose.connect(process.env.DbURL ,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log(" db connectiion success!!!");
}).catch((err)=>{
    console.log("db not connected!!!");
})