/*
  Warnings:

  - You are about to drop the column `vendor_name` on the `inventoryproducthistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inventoryproducthistory` DROP COLUMN `vendor_name`,
    ADD COLUMN `vendor_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `InventoryProductHistory` ADD CONSTRAINT `InventoryProductHistory_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `Vendor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
