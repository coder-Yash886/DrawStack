import axios from "axios"
import { BACKEND_URL } from "./config"
import { ChatRoomClient } from "../../../components/ChatRoomClient"

async function getRoomMessages(roomId: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
        return response.data.messages ?? []
    } catch {
        return []
    }
}

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.id
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const roomId = await getRoomId(slug)
    const messages = await getRoomMessages(roomId)

    return (
        <div>
            <ChatRoomClient
                id={roomId}
                messages={messages}
            />
        </div>
    )
}