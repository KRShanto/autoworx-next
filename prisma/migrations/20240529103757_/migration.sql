-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_invoice_item_id_fkey`;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_invoice_item_id_fkey` FOREIGN KEY (`invoice_item_id`) REFERENCES `InvoiceItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
