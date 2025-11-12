import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import jwt from "jsonwebtoken";
import ratelimit from 'express-rate-limit';
import dotnev from 'dotenv';
dotnev.config();
const app=express();
app.use(cors())
app.use(morgan("dev"));
const limiter=ratelimit({
    windowMs:60*1000,
    max:5,
    message:{message:"too many req sent"}
});
app.use(limiter);
const SECRECT_KEY=process.env.SECRECT_KEY;
const auth=(req,res,next)=>{
    const token=req.headers["authorization"];
    if(!token){
        return res.status(401).json({message:"Missing token"})
    }
    try{
        const decode=jwt.verify(token,SECRECT_KEY);
        req.user=decode;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"})
    }
}
app.use(
    "/auth",
    createProxyMiddleware({
        target:`http://localhost:${process.env.PORT_AUTH}`,
        changeOrigin:true,
        pathRewrite:{"^/auth":""},
    })
)
app.use(
    "/users",
    auth,
    createProxyMiddleware({
        target:`http://localhost:${process.env.PORT_USER}`,
        changeOrigin:true,
        pathRewrite:{"^/users":""},
    })
)
app.listen(5000,()=>{
    console.log("api gateway working");
})