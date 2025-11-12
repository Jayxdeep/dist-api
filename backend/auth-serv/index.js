import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const app=express();
app.use(express.json());
app.use(cors());
const SECRECT_KEY="mysecret123";
app.post('/login',(req,res)=>{
    const{username,password}=req.body;
    if(username==="jay" && password==="123"){
        const token=jwt.sign(
            {user:username},
            SECRECT_KEY,
            {expiresIn:"1hr"}
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