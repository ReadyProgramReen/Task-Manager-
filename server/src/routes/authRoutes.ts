import { Router, Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

const prisma = new PrismaClient();

//Register new users 
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
       return res.status(400).json({message: "User already exists"})
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

//Login returning user 
authRouter.post("/login", async (req:Request, res:Response)=>{
    const {email, password} = req.body;

    try {
        //check if email exist in the db
        const user = await prisma.user.findUnique({where : {email}})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        };

        //check if password matches hashed password
        const comparePassword = await bcrypt.compare(password,user.password)
        if(!comparePassword){
            return res.status(400).json({message: "Invalid password"})
        }

        //generate JWT
        const token = jwt.sign(
            {id:user.id,email:user.email},
            process.env.JWT_SECRET as string,
            {expiresIn:"1hr"}

        )

        //remove password form User model
        const {password:_,...returningUser} = user;

        //inform the client side that new user was successfully created and sent new user data without the password 
        res.status(200).json({
            message:"User is successfully logged-in ",
            token: token,
            user: returningUser 
            });
        

    } catch (error) {
        console.error("Login error:",error);
        res.status(500).json({message: "Login error"})
    }
})