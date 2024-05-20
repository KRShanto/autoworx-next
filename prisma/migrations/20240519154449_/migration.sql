-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_status_id_fkey`;

-- AlterTable
ALTER TABLE `invoice` MODIFY `customer_id` INTEGER NULL,
    MODIFY `vehicle_id` INTEGER NULL,
    MODIFY `subtotal` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `discount` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `tax` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `grand_total` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `deposit` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `due` DECIMAL(8, 2) NULL DEFAULT 0,
    MODIFY `status_id` INTEGER NULL,
    MODIFY `deposit_method` VARCHAR(191) NULL DEFAULT '',
    MODIFY `deposit_notes` VARCHAR(191) NULL DEFAULT '',
    MODIFY `type` ENUM('Invoice', 'Estimate') NULL DEFAULT 'Invoice';

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
