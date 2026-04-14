import {WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common";
import { de } from "zod/v4/locales";
import { string } from "zod/v4";

const wss = new WebSocketServer({ port: 8000 });

function checkUser(token: string): string | null{
    const decoded = jwt.verify(token,JWT_SECRET);
    if(typeof decoded == "string"){
        return null;
    }

    if(!decoded || !decoded.userId){
        return null;
    }
    return decoded.userId;
}

wss.on('connection', function connection(ws, request){

    const url  = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = checkUser(token);

    if(!userId){
        ws.close();
    }

    if(!decoded || !decoded.userId){
        ws.close(); 
        return;
    }
    ws.on('message', function message(data){
        ws.send('pong')
    })
})

