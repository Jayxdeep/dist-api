import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import morgan from 'morgan';
import cors from 'cors';
import jwt from "jsonwebtoken";
import ratelimit from 'express-rate-limit';
const app=express();
app.use(cors())
app.use(morgan("dev"));
const limiter=ratelimit({
    windowMs:60*1000,
    max:5,
    message:{message:"too many req sent"}
});
app.use(limiter);
const SECRECT_KEY="mysecret123";
const auth=(req,res,next)=>{
    const token=req.headers["authorization"];
    if(!token){
        return res.status(401).json({message:"Missing token"})
    }
    // if(req.headers["x-api-key"]==="secret123")return next();
    // res.status(401).json({message:"Unauthorised"});
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
        target:"http://localhost:5001",
        changeOrigin:true,
        pathRewrite:{"^/auth":""},
    })
)
app.use(
    "/users",
    auth,
    createProxyMiddleware({
        target:"http://localhost:5002",
        changeOrigin:true,
        pathRewrite:{"^/users":""},
    })
)
app.listen(5000,()=>{
    console.log("api gateway working");
})