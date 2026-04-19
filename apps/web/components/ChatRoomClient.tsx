"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[],
    id: string
}) {
    const [chats, setChats] = useState(messages)
    const [currentMessage, setCurrentMessage] = useState("")
    const { socketRef, loading } = useSocket()

    useEffect(() => {
        if (loading || !socketRef.current) return

        socketRef.current.send(JSON.stringify({
            type: "join_room",
            roomId: id
        }))

        socketRef.current.onmessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data)
            if (parsedData.type === 'chat') {
                setChats(c => [...c, { message: parsedData.message }])
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.onmessage = null
            }
        }
    }, [loading, id])

    const sendMessage = () => {
        const ws = socketRef.current
        if (!ws || ws.readyState !== WebSocket.OPEN) return

        ws.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }))
        setCurrentMessage("")
    }

    return (
        <div>
            {chats.map((m, i) => (
                <div key={i}>{m.message}</div>
            ))}

            <input
                type="text"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                suppressHydrationWarning
            />

            <button onClick={sendMessage}>
                Send message
            </button>
        </div>
    )
}