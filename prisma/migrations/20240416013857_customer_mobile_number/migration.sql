/*
  Warnings:

  - You are about to alter the column `mobile` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `mobile` INTEGER NOT NULL;
