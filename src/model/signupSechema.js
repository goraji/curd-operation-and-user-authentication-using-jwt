const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signupS  = new mongoose.Schema({
    name:{
        type:String,
        require : true
    },
    email:{
        type:String,
        require : true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

signupS.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (error) {
        console.log(`in schema page!!! error `);
    }
}

signupS.pre("save", async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = this.password
    }
})

const Signup = new mongoose.model(process.env.collectionName,signupS);
module.exports = Signup;