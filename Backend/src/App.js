import express from "express"
import cors from "cors";
import userRoutes from "./Routes/User.Routes.js"
import TaskRoutes from "./Routes/Task.Routes.js"
import ProjectRoutes from "./Routes/Project.Routes.js"
import cookieParser from "cookie-parser";



import { connectdb } from "./Config/db.Setup.js";

const app = express()
try {
await connectdb()  



app.use(cookieParser(process.env.SESSION_SECRET)) 
app.use(express.json()) 
app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:5175" , 
  credentials: true,
}))  




app.use("/user", userRoutes) 
app.use("/task", TaskRoutes)
app.use("/project", ProjectRoutes)

app.get("/", (req, res) => {
    res.send("live")
})



app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({ message: "Something went wrong!!" });
  });


 
    
} catch (error) {
    console.log(error)
    
} 

export default app

