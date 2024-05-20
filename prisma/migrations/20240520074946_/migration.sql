/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `labor_id` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `service` table. All the data in the column will be lost.
  - You are about to drop the `servicetag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_labor_id_fkey`;

-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `servicetag` DROP FOREIGN KEY `ServiceTag_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `servicetag` DROP FOREIGN KEY `ServiceTag_tag_id_fkey`;

-- AlterTable
ALTER TABLE `service` DROP COLUMN `invoice_id`,
    DROP COLUMN `labor_id`,
    DROP COLUMN `material_id`;

-- DropTable
DROP TABLE `servicetag`;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` VARCHAR(191) NOT NULL,
    `service_id` INTEGER NOT NULL,
    `material_id` INTEGER NOT NULL,
    `labor_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemTag` (
    `service_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`service_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_labor_id_fkey` FOREIGN KEY (`labor_id`) REFERENCES `Labor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTag` ADD CONSTRAINT `ItemTag_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTag` ADD CONSTRAINT `ItemTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
