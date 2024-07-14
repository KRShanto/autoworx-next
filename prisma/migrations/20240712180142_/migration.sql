-- AlterTable
ALTER TABLE `inventoryproducthistory` ADD COLUMN `price` DECIMAL(65, 30) NULL DEFAULT 0,
    ADD COLUMN `vendor_name` VARCHAR(191) NULL;
