import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario) {
      return NextResponse.json({ error: "Email o contraseña incorrectos, intente nuevamente" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, usuario.password)

    if (!isValid) {
      return NextResponse.json({ error: "Email o contraseña incorrectos, intente nuevamente" }, { status: 401 })
    }

    return NextResponse.json({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error en login" }, { status: 500 })
  }
}
