/*
  Warnings:

  - Added the required column `birthday` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Pastor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CellGroup" DROP CONSTRAINT "CellGroup_leaderId_fkey";

-- AlterTable
ALTER TABLE "CellGroup" ALTER COLUMN "leaderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Pastor" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ministry" ADD COLUMN     "leaderId" TEXT;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellGroup" ADD CONSTRAINT "CellGroup_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Pastor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministry" ADD CONSTRAINT "Ministry_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Pastor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
