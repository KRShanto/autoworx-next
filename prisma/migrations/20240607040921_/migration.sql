/*
  Warnings:

  - You are about to drop the column `description` on the `vendor` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `vendor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `vendor` table. All the data in the column will be lost.
  - Added the required column `name` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vendor` DROP COLUMN `description`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
