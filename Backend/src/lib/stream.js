import { StreamChat } from "stream-chat"
import { ENV } from "./env.js"

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
  throw new Error("Stream API Key or Secret missing")
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret) 

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([
      {
        id: userData.id,
        name: userData.name,
        image: userData.image,
      }
    ])

    console.log("Stream user upserted : ", userData.id)
  } catch (error) {
    console.error("Stream upsert failed : ", error)
  }
}

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId)
    console.log("Stream user deleted : ", userId)
  } catch (error) {
    console.error("Stream delete failed : ", error)
  }
}
