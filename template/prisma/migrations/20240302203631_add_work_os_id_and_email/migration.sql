/*
  Warnings:

  - A unique constraint covering the columns `[wosId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wosId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "wosId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_wosId_key" ON "User"("wosId");
