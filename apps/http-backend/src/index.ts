import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../../packages/backend-common/src/config"
import { middleware } from "./middleware";
import { prisma } from "@repo/db";
import { CreateUserSchema } from "@repo/common";


const app  = express();


app.use(express.json());

app.post("/signup", async (req, res) => {
    
    const result = CreateUserSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
             message: "Invalid input",
             errors: result.error.format()

             });
        return;
    }

    const data = result.data;

    
    const user = await prisma.user.create({
         data: { 
            email: data.email, 
            password: data.password, 
            name: data.name 
         } 
    });

    res.json({ userId: user.id });

}) 

app.post("/signin",(req,res) => {

    const userId = 1;
  const token =   jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        token
    })

})

app.post("/room", middleware,(req,res) => {

    res.json({
        roomId: 123
    })

})

app.listen(4000, () => {
    console.log("HTTP server listening on http://localhost:4000");
});