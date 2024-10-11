import axios from "axios";
import { BACKEND_URL } from "./chat-backend-config";

export async function promptMessage(message) {
    const response = await axios.post(BACKEND_URL + "/chat", {message})

    return response.data
    
}

export async function getAllMessages() {
    const url = BACKEND_URL + "/chat/all";
    console.log("IN ALL MESSAGE " + url)
    const response = await fetch(url);
    console.log("RESPONDES")

    console.log(JSON.stringify(response.data))
    return await response.json();
}