import express from 'express'
import cors from 'cors'
import dotenv from  'dotenv';

const app = express()

dotenv.config({
    path : '../.env',
})


// basic configuration 
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit : "16kb"}))
app.use(express.static('public'))

//cors configuration 
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT",'DELETE',"OPTIONS"],
    allowedHeaders: ['Content-type',"Authorisation"]
}))

// import the routes

import healthCheckRouter from './routes/healthCheck.route.js';
import authRouter from './routes/auth.routes.js'

app.use("/api/v1/health-check",healthCheckRouter)
app.use("/api/v1/auth",authRouter)


app.get("/",(req,res)=>{
    res.send("Welcome to base")
})


export default app