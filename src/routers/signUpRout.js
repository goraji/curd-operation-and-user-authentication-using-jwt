const express = require('express');
const bcrypt = require('bcrypt');
const router = new express.Router();
const Regis = require('../model/signupSechema');
const auth = require('../middleware/auth')

router.get('/',(req,res)=>{
    res.render('index');
})
router.get('/welcome',auth,async(req,res)=>{
    try {
        const data = await Regis.find();
        res.render('welcome',{details:data});

    } catch (error) {
        res,send(error)
    }
})
router.get("/delete/:id", async (req, res) => {
    try {
        const data =  await Regis.findByIdAndRemove(req.params.id);
        res.redirect('/welcome');
    } catch (err) {
      res.send("error deleete data");
    }
  });
  router.get("/update/:id", async (req, res) => {
    try {
        const data =  await Regis.findById(req.params.id);
        res.render('update',{details:data});
    } catch (err) {
      res.send("error in update page");
    }
  });

  router.post("/update", async(req, res) => {
      try {
        const id = req.body.id;
        const data = await Regis.findByIdAndUpdate(id, req.body, {
        new: true,
        });
        // console.log(data);
          res.redirect("/welcome");
      } catch (error) {
          res.send("error in update page"+error)
      }
    
  });

router.get('/logout',auth,async(req,res)=>{
    try {
        req.data.tokens = req.data.tokens.filter((currE)=>{
            return currE.token != req.token;
        })
        // req.data.tokens = []
        res.clearCookie('jwt');
        console.log('logout successfully!!!');
        await req.data.save();
        res.status(201).redirect('loginpage')   
    } catch (error) {
        res.status(501).send(error)
    }
})

router.get('/loginpage',(req,res)=>{
    res.render('loginpage');
})

router.post('/loginpage',async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const data =  await Regis.findOne({email:email});
        const isMatch =await bcrypt.compare(password,data.password);
        if(isMatch){
            const token = await data.generateAuthToken();
            console.log(token);
            let week = 365*24*3600*1000;
            res.cookie('jwt',token,{
                expires:new Date(Date.now() +  week),
                httpOnly:true
            });
            res.status(200).redirect('welcome');
        }else{
            res.render('loginpage',{
                errorComm:"password not matched"
            })
        }
    } catch (error) {
        res.render('loginpage',{
            errorComm:"Invalid email-id"
        })
    }
    
})
router.get('/registerpage',(req,res)=>{
    res.render('registerpage');
    
})
router.post('/registerpage',async(req,res)=>{
    try {
        const pass = req.body.password;
        const cpass = req.body.cpassword;
        if (pass === cpass) {
            const data = new Regis({
                name:req.body.name,
                email:req.body.email,
                password:pass,
                cpassword:cpass
            })
            const token = await data.generateAuthToken();
            res.cookie('jwt',token,{
                expires:new Date(Date.now() + 90000),
                httpOnly:true
            });
            const user = await data.save();
            res.redirect('welcome');
        } else {
            res.send('password not matched');
        }
    } catch (error) {
        res.send(error)
        console.log(error);
        
    }
})

module.exports = router