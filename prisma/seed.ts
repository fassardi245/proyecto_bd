import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function findOrCreatePlan(tipo: string, costo: number) {
  let plan = await prisma.plan.findFirst({ where: { tipo } });
  if (!plan) {
    plan = await prisma.plan.create({ data: { tipo, costo, estado: "activo" } });
  }
  return plan;
}

async function main() {
  const mensual = await findOrCreatePlan("Mensual", 10000);
  const trimestral = await findOrCreatePlan("Trimestral", 25000);
  const anual = await findOrCreatePlan("Anual", 90000);


  const fuerza = await prisma.rutina.create({ data: { nombre: "Fuerza Total", nivel: "Intermedio", duracion: 8, objetivo: "fuerza" } })
  const volumen = await prisma.rutina.create({ data: { nombre: "Volumen Máximo", nivel: "Avanzado", duracion: 12, objetivo: "volumen" } })
  const cardio = await prisma.rutina.create({ data: { nombre: "Cardio Intenso", nivel: "Principiante", duracion: 6, objetivo: "cardio" } })

  const socio1 = await prisma.socio.create({ data: { nombre: "Juan", apellido: "Pérez", edad: 28, email: "juan@example.com", estado: "activo", planId: mensual.id, rutinaId: fuerza.id } })
  const socio2 = await prisma.socio.create({ data: { nombre: "María", apellido: "Gómez", edad: 32, email: "maria@example.com", estado: "inactivo", planId: anual.id, rutinaId: volumen.id } })
  const socio3 = await prisma.socio.create({ data: { nombre: "Lucas", apellido: "Rodríguez", edad: 25, email: "lucas@example.com", estado: "activo", planId: mensual.id, rutinaId: cardio.id } })
  const socio4 = await prisma.socio.create({ data: { nombre: "Laura", apellido: "Fernández", edad: 30, email: "laura@example.com", estado: "activo", planId: trimestral.id, rutinaId: volumen.id } })
  const socio5 = await prisma.socio.create({ data: { nombre: "Martín", apellido: "Sosa", edad: 27, email: "martin@example.com", estado: "activo", planId: mensual.id, rutinaId: fuerza.id } })
  const socio6 = await prisma.socio.create({ data: { nombre: "Sofía", apellido: "López", edad: 29, email: "sofia@example.com", estado: "activo", planId: trimestral.id, rutinaId: cardio.id } })
  const socio7 = await prisma.socio.create({ data: { nombre: "Diego", apellido: "Ramírez", edad: 31, email: "diego@example.com", estado: "activo", planId: anual.id, rutinaId: fuerza.id } })
  const socio8 = await prisma.socio.create({ data: { nombre: "Valentina", apellido: "Mendoza", edad: 26, email: "valentina@example.com", estado: "activo", planId: mensual.id, rutinaId: volumen.id } })

  const socioRojo = await prisma.socio.create({
    data: { nombre: "Carlos", apellido: "Moreno", edad: 40, email: "carlos@example.com", estado: "activo", planId: mensual.id, rutinaId: fuerza.id }
  })

  await prisma.pago.create({ data: { fecha: new Date(), monto: 10000, metodo: "Tarjeta", estado: "pagado", socioId: socio1.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 90000, metodo: "Efectivo", estado: "atrasado", socioId: socio2.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 10000, metodo: "Tarjeta", estado: "pagado", socioId: socio3.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 25000, metodo: "Efectivo", estado: "vencido", socioId: socio4.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 10000, metodo: "Tarjeta", estado: "pagado", socioId: socio5.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 25000, metodo: "Efectivo", estado: "pagado", socioId: socio6.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 90000, metodo: "Tarjeta", estado: "pagado", socioId: socio7.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 10000, metodo: "Efectivo", estado: "pagado", socioId: socio8.id } })

  await prisma.pago.create({ data: { fecha: new Date(), monto: 10000, metodo: "Tarjeta", estado: "atrasado", socioId: socioRojo.id } })
  await prisma.pago.create({ data: { fecha: new Date(), monto: 15000, metodo: "Efectivo", estado: "vencido", socioId: socioRojo.id } })

  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio1.id, clase: "Crossfit" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio2.id, clase: "Yoga" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio3.id, clase: "Crossfit" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio4.id, clase: "Spinning" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio5.id, clase: "Crossfit" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio6.id, clase: "Yoga" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio7.id, clase: "Spinning" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socio8.id, clase: "Crossfit" } })
  await prisma.asistencia.create({ data: { fecha: new Date(), socioId: socioRojo.id, clase: "Crossfit" } })

  const hashedPassAdmin = await bcrypt.hash("teo123", 10)
  await prisma.usuario.upsert({
    where: { email: "admin@gimnasio.com" },
    update: {},
    create: {
      email: "admin@gimnasio.com",
      password: hashedPassAdmin,
      role: "admin"
    }
  })

  console.log("Datos insertados en todas las tablas ✅")
}

main()
  .then(() => console.log("Seed completado ✅"))
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect() })
