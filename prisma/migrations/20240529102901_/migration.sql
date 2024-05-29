/*
  Warnings:

  - You are about to drop the column `statusId` on the `technician` table. All the data in the column will be lost.
  - Made the column `type` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `invoice_item_id` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_statusId_fkey`;

-- AlterTable
ALTER TABLE `invoice` MODIFY `type` ENUM('Invoice', 'Estimate') NOT NULL DEFAULT 'Invoice';

-- AlterTable
ALTER TABLE `technician` DROP COLUMN `statusId`,
    ADD COLUMN `invoice_item_id` INTEGER NOT NULL,
    ADD COLUMN `status_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_invoice_item_id_fkey` FOREIGN KEY (`invoice_item_id`) REFERENCES `InvoiceItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
