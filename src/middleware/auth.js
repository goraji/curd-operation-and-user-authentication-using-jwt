const jwt = require('jsonwebtoken');
const Regis = require('../model/signupSechema')

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
        // console.log(verifyUser);
        const data = await Regis.findOne({_id:verifyUser._id})
        // console.log(data);
        req.token = token;
        req.data = data;
        
        next()
// nth is added
    } catch (error) {
        res.status(401).send(error)
    }
    
}

module.exports = auth;