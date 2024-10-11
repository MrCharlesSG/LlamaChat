import { AUTH_ENDPOINT } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/chat-backend-config";
import { saveSession } from "@/lib/session";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const url = BACKEND_URL + AUTH_ENDPOINT + "login/oauth/github" + body.code
    console.log("The url for oauth " + url)
    const response = await axios.post(url, null, {
        headers: {
          'Content-Type': 'application/json', 
        }
    })



    await saveSession(response.data);
    
    // Devolver respuesta de éxito
    //return NextResponse.redirect("http://localhost:3000/chat")
    return NextResponse.json({ success: true },  { status: 200 });
  } catch (error) {
    console.error('Error saving session:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Couldnt save session' }, { status: 400 });
  }
}
