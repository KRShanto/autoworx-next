/*
  Warnings:

  - You are about to drop the column `material_id` on the `invoiceitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_material_id_fkey`;

-- AlterTable
ALTER TABLE `invoiceitem` DROP COLUMN `material_id`,
    ADD COLUMN `materialId` INTEGER NULL;

-- CreateTable
CREATE TABLE `InvoiceItemMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_item_id` INTEGER NOT NULL,
    `material_id` INTEGER NULL,
    `inventory_product_id` INTEGER NULL,
    `type` ENUM('Material', 'Product') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItemMaterial` ADD CONSTRAINT `InvoiceItemMaterial_invoice_item_id_fkey` FOREIGN KEY (`invoice_item_id`) REFERENCES `InvoiceItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItemMaterial` ADD CONSTRAINT `InvoiceItemMaterial_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItemMaterial` ADD CONSTRAINT `InvoiceItemMaterial_inventory_product_id_fkey` FOREIGN KEY (`inventory_product_id`) REFERENCES `InventoryProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
