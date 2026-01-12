import express from "express"
import path from 'path'
import cors from 'cors'
import { serve } from "inngest/express"
import { clerkMiddleware } from '@clerk/express'


import { ENV } from "./lib/env.js"
import { connectDB } from "./lib/db.js"
import { inngest , functions} from "./lib/inngest.js"
import { protectRoute } from "./middleware/protectRoute.js"
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"

const app = express()

app.use(express.json())
app.use(cors({origin : ENV.CLIENT_URL , credentials : true })) // credentials true mean => server allows a browers to include  cookies on request
app.use(clerkMiddleware()) // this adds auth field to req obj : req.auth()

app.use("/api/inngest" , serve({client : inngest , functions}))
app.use("/api/chat" , chatRoutes);
app.use("/api/sessions" , sessionRoutes);

const __dirname = path.resolve()

app.get("/hello" , (req , res)=>{
    res.status(200).json({msg : "success form apiss"})
})

//make ready for deploy
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "../FrontEnd/dist")))

    app.get("/{*any}" , (req , res)=>{
        res.sendFile(path.join(__dirname , "../FrontEnd" , "dist" , "index.html"))
    })
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running at port 3000"))
  } catch (error) {
    console.error("Error starting the server", error)
  }
}

startServer()