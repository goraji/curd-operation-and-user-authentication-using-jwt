require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = process.env.port || 9000;
app.use(express.json());

require('./db/conn');
const signupRout = require("./routers/signUpRout");


const staticPath = path.join(__dirname,"../public");
const partialPath = path.join(__dirname,"../src/templates/partials");
const viewPath = path.join(__dirname,"../src/templates/views");

app.use(cookieParser())
app.use(express.static(staticPath));
app.use(express.urlencoded({extended:false}));

app.set('view engine','hbs');
app.set('views',viewPath)

hbs.registerPartials(partialPath);

app.use(signupRout);

app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})