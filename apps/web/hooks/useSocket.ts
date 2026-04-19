import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../app/room/[slug]/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            console.error("No token found")
            return
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            setLoading(false)
            socketRef.current = ws
        }

        ws.onclose = () => {
            setLoading(true)
            socketRef.current = null
        }

        ws.onerror = (err) => {
            console.error("WS Error:", err)
        }

        socketRef.current = ws

        return () => {
            ws.onclose = null
            ws.close()
        }
    }, [])

    return { socketRef, loading }
}