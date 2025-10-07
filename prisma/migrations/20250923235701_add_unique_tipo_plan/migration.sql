/*
  Warnings:

  - A unique constraint covering the columns `[tipo]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plan_tipo_key" ON "public"."Plan"("tipo");
