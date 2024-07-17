/*
  Warnings:

  - You are about to drop the column `assigned_by` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_item_id` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `work_note` on the `technician` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_invoice_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_status_id_fkey`;

-- AlterTable
ALTER TABLE `technician` DROP COLUMN `assigned_by`,
    DROP COLUMN `invoice_item_id`,
    DROP COLUMN `status_id`,
    DROP COLUMN `work_note`,
    ADD COLUMN `material_id` INTEGER NULL,
    ADD COLUMN `service_id` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `statusColor` VARCHAR(191) NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD COLUMN `work_order_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `WorkOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkOrder` ADD CONSTRAINT `WorkOrder_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `WorkOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
