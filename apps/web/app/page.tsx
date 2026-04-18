"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const [roomId, setRoomId] = useState("")
  const router = useRouter();

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width:"100vw"
    }}>
    <div>
      <input 
      style={{padding: "10px"}}
      type="text" 
      onChange={(e) => {
        setRoomId(e.target.value)
      }}
      value={roomId} 
      placeholder="Room id"
      >
      </input>

      <button style={{padding:"10px"}} onClick={() =>{
        router.push(`/room/${roomId}`)

      }}>Join Room</button>
    </div>
    </div>
  )
}
