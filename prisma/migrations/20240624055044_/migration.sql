/*
  Warnings:

  - You are about to drop the column `materialId` on the `invoiceitem` table. All the data in the column will be lost.
  - You are about to drop the `invoiceitemmaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitemmaterial` DROP FOREIGN KEY `InvoiceItemMaterial_inventory_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitemmaterial` DROP FOREIGN KEY `InvoiceItemMaterial_invoice_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitemmaterial` DROP FOREIGN KEY `InvoiceItemMaterial_material_id_fkey`;

-- AlterTable
ALTER TABLE `invoiceitem` DROP COLUMN `materialId`;

-- AlterTable
ALTER TABLE `material` ADD COLUMN `invoice_item_id` INTEGER NULL,
    ADD COLUMN `product_id` INTEGER NULL;

-- DropTable
DROP TABLE `invoiceitemmaterial`;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_invoice_item_id_fkey` FOREIGN KEY (`invoice_item_id`) REFERENCES `InvoiceItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `InventoryProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
