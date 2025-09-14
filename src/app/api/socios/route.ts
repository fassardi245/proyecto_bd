import { prisma } from "../../../../prisma/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const socios = await prisma.socio.findMany({
      include: { plan: true, rutina: true }, // trae datos relacionados
    })
    return NextResponse.json(socios)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al traer socios" }, { status: 500 })
  }
}
