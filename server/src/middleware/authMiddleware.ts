import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request{
    user?:{
    id: number;
    email: string;
    iat: number;
    exp: number;
  };
}

export const authenticateToken = (req:AuthRequest,res:Response, next:NextFunction)=>{

    //Acess Authentication from req header
    const authHeaders = req.headers.authorization;
    
    //access token from authenication without the Bearer
    const token = authHeaders &&  authHeaders.split(" ")[1];

    //if token does not exit
    if(!token){
        return res.status(401).json({message: "Access token missing"})
    }

    try {
        //verify jwt token send from the client side 
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string)

        //type narrowing in case decoded is a string not a payload
        if (typeof decoded === "string") {
            return res.status(403).json({ message: "Invalid token payload" });
        }
        
        //attach the payload data in req.user
        req.user = decoded as {
        id: number;
        email: string;
        iat: number;
        exp: number;
        };
        //call next to run the next route
        next();
        
    } catch (error) {
         return res.status(403).json({ message: "Invalid or expired token" });

    }

    

}