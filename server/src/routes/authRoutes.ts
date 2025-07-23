import { Router, Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const authRouter = Router();

const prisma = new PrismaClient();

authRouter.post("/", async (req:Request, res:Response)=>{

const {name, email, password} = req.body;

try {
    //check if all input are field
    if(!name || !email || !password){
        res.status(400).json({message: "Please fill out all the User registration input fields"})
    }

    //check if user already exist 
    const existUser = await prisma.user.findUnique({where: {email}});
    if(existUser){
        res.status(400).json({message: "User already exists"})
    }

    //hash password 
    const hashedPassword = await bcrypt.hash(password,10)

    //create user 
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password:hashedPassword,
        },

    });

    //inform the client side that new user was successfully created and sent new user data without the password 
    const {password:_, ...newUser} = user
    res.status(201).json({message:"User created successfully", newUser});

} catch (error) {
    console.error("Error reqistering user:", error);

    res.status(500).json({message : "Server error"});
    
}

})