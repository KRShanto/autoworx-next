/*
  Warnings:

  - You are about to drop the column `amount` on the `otherpayment` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `statusColor` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `work_order_id` on the `technician` table. All the data in the column will be lost.
  - You are about to drop the column `employeeDepartment` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `employeeType` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(11))` to `Enum(EnumId(2))`.
  - You are about to drop the `workorder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `Technician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_id` to the `Technician` table without a default value. This is not possible if the table is not empty.
  - Made the column `service_id` on table `technician` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `technician` DROP FOREIGN KEY `Technician_work_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `workorder` DROP FOREIGN KEY `WorkOrder_invoiceId_fkey`;

-- AlterTable
ALTER TABLE `otherpayment` DROP COLUMN `amount`;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amount` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `technician` DROP COLUMN `material_id`,
    DROP COLUMN `statusColor`,
    DROP COLUMN `work_order_id`,
    ADD COLUMN `company_id` INTEGER NOT NULL,
    ADD COLUMN `date_closed` DATETIME(3) NULL,
    ADD COLUMN `invoice_id` VARCHAR(191) NOT NULL,
    MODIFY `service_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `employeeDepartment`,
    DROP COLUMN `name`,
    ADD COLUMN `commission` DECIMAL(65, 30) NULL DEFAULT 0,
    ADD COLUMN `company_name` VARCHAR(191) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `join_date` DATETIME(3) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    MODIFY `employeeType` ENUM('Sales', 'Technician') NOT NULL DEFAULT 'Sales';

-- DropTable
DROP TABLE `workorder`;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Technician` ADD CONSTRAINT `Technician_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
