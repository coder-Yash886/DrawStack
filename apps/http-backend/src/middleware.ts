import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

function getTokenFromHeader(header: string | string[] | undefined) {
    const raw = Array.isArray(header) ? header[0] : (header ?? "");
    return String(raw).replace(/^Bearer\s+/i, "");
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromHeader(req.headers["authorization"]);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        if (decoded.userId) {
            (req as any).userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            });
        }
    } catch (err) {
        res.status(403).json({
            message: "Invalid token"
        });
    }
}