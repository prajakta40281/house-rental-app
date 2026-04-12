import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";



export const authMiddleware = (
    req : AuthRequest,
    res : Response,
    next : NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message : "no token provide"
        });
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(
            token,
             process.env.JWT_SECRET as string
        ) as any;

        req.userId = decoded.userId;
        console.log("DECODED:", decoded);
        
        next();
    } catch {
        res.status(401).json({
            message : "Invalid token"
        });
    }
};