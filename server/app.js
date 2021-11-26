const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const searchRouter = require('./routers/search');
const port = 80;
require("dotenv").config();
console.log(process.env.CLIENT_ID,'나와라라라')
global.__basedir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']
    })
  );

app.use(cookieParser());

app.use('/search', searchRouter);

app.get('/',(req,res)=>{
    res.status(201).send('hello world');
})

app.listen(port,()=>{
    console.log('server running');
})