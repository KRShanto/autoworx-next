/*
  Warnings:

  - You are about to drop the column `hue` on the `tag` table. All the data in the column will be lost.
  - Added the required column `bgColor` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textColor` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tag` DROP COLUMN `hue`,
    ADD COLUMN `bgColor` VARCHAR(191) NOT NULL,
    ADD COLUMN `textColor` VARCHAR(191) NOT NULL;
