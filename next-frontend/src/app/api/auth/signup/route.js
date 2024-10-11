import { login, register } from "@/lib/auth";
import { saveSession } from "@/lib/session";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const credentials = {
      email: body.email,
      password: body.password,
      name:body.name,
    };


    const registerResponse = await register(credentials);

    await saveSession(registerResponse.data, registerResponse);
    
    // Devolver respuesta de éxito
    //return NextResponse.redirect("http://localhost:3000/chat")
    return NextResponse.json({ success: true },  { status: 200 });
  } catch (error) {
    console.error('Login error:', error);

    // Devolver respuesta de error
    return NextResponse.json({ error: 'Failed to log in' }, { status: 400 });
  }
}
