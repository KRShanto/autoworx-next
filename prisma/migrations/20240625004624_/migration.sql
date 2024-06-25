-- AlterTable
ALTER TABLE `material` ADD COLUMN `invoice_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
