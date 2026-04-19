import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8000 });

interface User {
    userId: string;
    rooms: string[];
    ws: any;
}
const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") return null;
        if (!decoded || !decoded.userId) return null;
        return decoded.userId;
    } catch {
        return null;
    }
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId === null) {
        ws.close();
        return;
    }

    users.push({ userId, rooms: [], ws });

    ws.on("message", async function message(data) {
        const dataStr = data.toString()
        if (!dataStr || dataStr.trim() === "") return

        let parsedData;
        try {
            parsedData = JSON.parse(dataStr)
        } catch(e) {
            console.error("Invalid JSON:", dataStr)
            return
        }

        if (parsedData.type === "join_room") {
            const user = users.find((x) => x.ws === ws);
            user?.rooms.push(parsedData.roomId); 
        }

        if (parsedData.type === "leave_room") {
            const user = users.find((x) => x.ws === ws);
            if (!user) return;
            user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        }

        if (parsedData.type === "chat") {
            const roomSlug = parsedData.roomId; 
            const message = parsedData.message;

            if (!roomSlug || !message) return;

            const room = await prisma.room.findUnique({
                where: { slug: roomSlug }
            });

            if (!room) {
                console.error("Room not found:", roomSlug)
                return;
            }

            await prisma.chat.create({
                data: {
                    roomId: room.id, // ← UUID
                    message,
                    userId,
                },
            });

            users.forEach((user) => {
                if (user.rooms.includes(roomSlug)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message,
                        roomId: roomSlug,
                    }))
                }
            });
        }
    });

    ws.on("close", () => {
        const index = users.findIndex((x) => x.ws === ws);
        if (index !== -1) users.splice(index, 1);
    });
});