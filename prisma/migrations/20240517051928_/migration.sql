/*
  Warnings:

  - Added the required column `color` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `labor` ADD COLUMN `add_to_canned_labor` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `tag` ADD COLUMN `color` VARCHAR(191) NOT NULL;
