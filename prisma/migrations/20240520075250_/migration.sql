-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_labor_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_service_id_fkey`;

-- AlterTable
ALTER TABLE `invoiceitem` MODIFY `invoice_id` VARCHAR(191) NULL,
    MODIFY `service_id` INTEGER NULL,
    MODIFY `material_id` INTEGER NULL,
    MODIFY `labor_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_labor_id_fkey` FOREIGN KEY (`labor_id`) REFERENCES `Labor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
