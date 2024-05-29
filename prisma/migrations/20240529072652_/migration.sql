/*
  Warnings:

  - You are about to drop the column `invoice_tag` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `work_order_id` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `work_order_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `workorder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_work_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_work_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `workorder` DROP FOREIGN KEY `WorkOrder_company_id_fkey`;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `invoice_tag`,
    DROP COLUMN `work_order_id`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `work_order_id`;

-- DropTable
DROP TABLE `workorder`;

-- CreateTable
CREATE TABLE `Technician` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assigned_by` VARCHAR(191) NULL,
    `assigned_date` DATETIME(3) NULL,
    `due` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DECIMAL(65, 30) NULL DEFAULT 0,
    `priority` ENUM('Low', 'Medium', 'High') NULL DEFAULT 'Low',
    `statusId` INTEGER NULL,
    `new_note` VARCHAR(191) NULL,
    `work_note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
