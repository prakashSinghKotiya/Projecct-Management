import express from "express"

import checkAuth from "../Middlewares/auth.Middleware.js"
import { loginUser, logout, registerUser, userDetails } from "../Controllers/User.Controller.js"




const router = express.Router()


router.post("/register", registerUser)

router.post("/login",loginUser )

router.get("/",checkAuth, userDetails)

router.post("/logout", checkAuth, logout)



 

export default router