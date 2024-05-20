/*
  Warnings:

  - The primary key for the `invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `invoice_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `issue_date` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `salesperson` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `send_mail` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `service_ids` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_invoice_id_fkey`;

-- DropIndex
DROP INDEX `Invoice_invoice_id_key` ON `invoice`;

-- AlterTable
ALTER TABLE `invoice` DROP PRIMARY KEY,
    DROP COLUMN `invoice_id`,
    DROP COLUMN `issue_date`,
    DROP COLUMN `notes`,
    DROP COLUMN `photo`,
    DROP COLUMN `salesperson`,
    DROP COLUMN `send_mail`,
    DROP COLUMN `service_ids`,
    DROP COLUMN `tags`,
    ADD COLUMN `customerComments` VARCHAR(191) NULL,
    ADD COLUMN `customerNotes` VARCHAR(191) NULL,
    ADD COLUMN `deposit_method` VARCHAR(191) NULL,
    ADD COLUMN `deposit_notes` VARCHAR(191) NULL,
    ADD COLUMN `internalNotes` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('Invoice', 'Estimate') NOT NULL DEFAULT 'Invoice',
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `service` ADD COLUMN `invoice_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `invoice_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `payment`;

-- CreateTable
CREATE TABLE `InvoicePhoto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `fk_invoice_photos_invoice`(`invoice_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicePhoto` ADD CONSTRAINT `InvoicePhoto_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
