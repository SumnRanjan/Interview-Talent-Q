import express from "express"
import { ENV } from "./lib/env.js"

const app = express()

app.get("/" , (req , res)=>{
    res.status(200).json({msg : "success form apiss"})
})

app.listen(ENV.PORT , ()=>{
    console.log("Server is running at port 3000")
})