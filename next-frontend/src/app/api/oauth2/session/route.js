import { login } from "@/lib/auth";
import { saveSession } from "@/lib/session";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("The body in saving session ", body)



    await saveSession(body);
    
    // Devolver respuesta de éxito
    //return NextResponse.redirect("http://localhost:3000/chat")
    return NextResponse.json({ success: true },  { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
  }
}
