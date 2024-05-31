/*
  Warnings:

  - You are about to drop the column `color` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Vehicle` DROP COLUMN `color`,
    ADD COLUMN `bgColor` VARCHAR(191) NULL,
    ADD COLUMN `textColor` VARCHAR(191) NULL;
