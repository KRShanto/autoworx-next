/*
  Warnings:

  - Added the required column `invoice_invoice_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `invoice_invoice_id` VARCHAR(191) NOT NULL;
