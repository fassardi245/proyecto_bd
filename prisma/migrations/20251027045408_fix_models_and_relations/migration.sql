/*
  Warnings:

  - You are about to drop the column `clase` on the `Asistencia` table. All the data in the column will be lost.
  - Added the required column `rutinaId` to the `Asistencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Asistencia" DROP COLUMN "clase",
ADD COLUMN     "rutinaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "public"."Rutina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
