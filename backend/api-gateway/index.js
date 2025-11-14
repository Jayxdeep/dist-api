import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import jwt from "jsonwebtoken";
import ratelimit from 'express-rate-limit';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';
import dotenv from 'dotenv';
dotenv.config({path: "../.env"});
const app=express();
app.use(cors())
app.use(morgan("dev"));
const limiter=ratelimit({
    windowMs:60*1000,//every 1min reqs are checked
    max:5,//max connections from single ip address [5 reqs]
    message:{message:"too many req sent"}
});
app.use(limiter);
const SECRET_KEY=process.env.SECRET_KEY;
const auth=(req,res,next)=>{
    const token=req.headers["authorization"];
    if(!token){
        return res.status(401).json({message:"Missing token"})
    }
    try{
        const decode=jwt.verify(token,SECRET_KEY);
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
        pathRewrite:{"^/auth": ""},
    })
)
app.use(
    "/users",
    auth,
    cacheMiddleware,
    createProxyMiddleware({
        target:`http://localhost:${process.env.PORT_USER}`,
        changeOrigin:true,
        pathRewrite:{"^/users":""},
    })
)
console.log("gateway env",{
    SECRET_KEY:process.env.SECRET_KEY,
    PORT_AUTH:process.env.PORT_AUTH,
    PORT_USER:process.env.PORT_USER
})
app.listen(5000,()=>{
    console.log("api gateway working");
})