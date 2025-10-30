-- CreateEnum
CREATE TYPE "public"."EstadoSocio" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."EstadoPago" AS ENUM ('pagado', 'vencido', 'pendiente');

-- CreateEnum
CREATE TYPE "public"."MetodoPago" AS ENUM ('tarjeta', 'efectivo', 'transferencia', 'debito');

-- CreateEnum
CREATE TYPE "public"."ObjetivoRutina" AS ENUM ('fuerza', 'volumen', 'cardio', 'mixto');

-- CreateTable
CREATE TABLE "public"."Socio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "estado" "public"."EstadoSocio" NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planId" INTEGER,
    "rutinaId" INTEGER,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "costo" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rutina" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "objetivo" "public"."ObjetivoRutina" NOT NULL,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asistencia" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "socioId" INTEGER NOT NULL,
    "clase" TEXT NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pago" (
    "id" SERIAL NOT NULL,
    "fechaEsperada" TIMESTAMP(3) NOT NULL,
    "fechaReal" TIMESTAMP(3),
    "monto" INTEGER NOT NULL,
    "metodo" "public"."MetodoPago",
    "estado" "public"."EstadoPago" NOT NULL DEFAULT 'pendiente',
    "socioId" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "email" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socio_email_key" ON "public"."Socio"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_tipo_key" ON "public"."Plan"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Socio" ADD CONSTRAINT "Socio_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Socio" ADD CONSTRAINT "Socio_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "public"."Rutina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pago" ADD CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
