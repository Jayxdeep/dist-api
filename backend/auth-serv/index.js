import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: "../.env"});
const app=express();
app.use(express.json());
app.use(cors());
const SECRET_KEY=process.env.SECRET_KEY;
const USERNAME=process.env.USER_USERNAME;
const PASSWORD=process.env.USER_PASSWORD;
console.log("auth env",{
    SECRET_KEY,
    USERNAME,
    PASSWORD
})
app.post('/login',(req,res)=>{
    const{username,password}=req.body;
    if(username===USERNAME && password===PASSWORD){
        const token=jwt.sign(
            {user:username},
            SECRET_KEY,
            {expiresIn:"1h"}
        )
        return res.json({
            token,
            message:"login successfull",
        })
    }
    res.status(401).json({message:"Invalid credits"})

})
app.listen(5001,()=>{
    console.log("auth service running")
})