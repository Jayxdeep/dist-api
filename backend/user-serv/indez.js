import express from 'express'
import cors from 'cors'
const app=express();
app.use(express.json())
app.use(cors());
app.get('/profile',(req,res)=>{
    res.json({
        name:"jaydeep",
        role:"Student",
        usn:"1nh22ec066",
    })
})
app.listen(5002,()=>{
    console.log("user serv running");
})