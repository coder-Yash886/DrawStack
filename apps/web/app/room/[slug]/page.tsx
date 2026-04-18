import axios from "axios"
import { BACKEND_URL } from "./config"

async function getRoomId(slug: string){
    const reponse = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return reponse.data.id

}

export default async function Page({
  params,
}: {
  params:{
    slug: string
  }

}) {

    const slug = params.slug
    const roomId = await getRoomId(slug)
  
}