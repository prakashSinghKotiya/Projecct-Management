


import bcrypt from "bcrypt"


import mongoose, { Types } from "mongoose"

import { loginSchema, registerSchema } from "../Validators/zod.validator.js"
import User from "../Models/User.Model.js"
import z from "zod"
import Project from "../Models/Project.Model.js"



export const registerUser = async(req, res, next)=>{
    console.log(req.body)
    
    const {success , data , error} = registerSchema.safeParse(req.body)

    if(!success){
        return res.status(400).json({error: z.flattenError(error).fieldErrors})

    }
    const{email , name , password } = data
    
   
    const hashPassword = await bcrypt.hash(password, 12 ) 
  
    const userExist = await User.findOne({email})
    if(userExist){
        return res.status(409).json({
                error: "user already exist" ,
                message: "user already exist"
            })}

    
      const ssn = await mongoose.startSession();
    
        try {
     ssn.startTransaction() 
     const userId = new Types.ObjectId();

     await User.create([{ 
        _id:userId,
        name,
        email,
        password:hashPassword,
    }],{session: ssn })
        
  
      ssn.commitTransaction()
    res.status(201).json({ message: "User Registered" });
        
      } catch (err){
        console.log(err)
        await ssn.abortTransaction(); 
      if(err.code === 121) {
      res
        .json({ error: "Invalid input, please enter valid details" });

      
    } else {
      next(err);
    }
        
      }      

}

export const loginUser = async(req, res, next)=>{
    try{
         const {success , data , error} = loginSchema.safeParse(req.body) //sanitizing db inputs

    if(!success){
        console.log(error)
        return res.status(400).json({error: z.flattenError(error).fieldErrors})
    }
    const{email, password} = data
    
    
    const user = await User.findOne({email}) 
    if(!user){
        return res.status(404).json({ error: "Invalid Credentials" });
    }


    const ispassValid = await bcrypt.compare(password, user.password) 
    if(!ispassValid){
        return res.status(404).json({ error: "Invalid Credentials" });
    }
    
  

    res.cookie("sid", user._id ,{  
        httpOnly: true,
        signed: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",  
        secure: true
    })
    res.json({ message: "logged in" });
}
    catch(err){
        console.log(err)
        next(err)
    }
}

    

export const userDetails = async(req, res)=>{ 
  
    const user = await User.findById(req.user._id)
     const project = await Project.findById(req.user.rootprojectId).lean()

    
    console.log("userdetails",user);

   
    
    res.status(200).json({
        name : user.name, 
        email: user.email,
        picture: user.picture,
        project: project
    })


}

export const logout = async (req, res)=>{
    res.clearCookie("sid") 
    res.status(204).end();
}

