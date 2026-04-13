import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../../packages/backend-common/src/config"
import { middleware } from "./middleware";
import { prisma } from "@repo/db";
import { CreateUserSchema } from "@repo/common";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();


const app  = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    
    const result = CreateUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.format()
        });
    }

    const data = result.data;

    try {
        
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name
            }
        });

        return res.json({ userId: user.id });

    }  catch (e: any) {
      console.error("Signup error:", e); 

    if (e?.code === "P2002") {
        return res.status(409).json({
            message: "User already exists with this email"
        });
    }
    return res.status(500).json({
        message: "Internal server error"
    });
}
});

app.post("/signin",async (req,res) => {

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "Email and password required"
        })
    }

    try{

        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!user){
            return res.status(401).json({
                message: "Invalid email and password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email and password"
            })
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ token });

        
    }catch(e: any){
        console.error("Signin error:", e);
        return res.status(500).json({
            message: "Internal server error"
        });

    }
})

app.post("/room", middleware,(req,res) => {

    res.json({
        roomId: 123
    })

})

app.listen(4000, () => {
    console.log("HTTP server listening on http://localhost:4000");
});