/*
  Warnings:

  - You are about to drop the column `customer_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_tag` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `work_order_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_vehicle_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_work_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_user_id_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `customer_id`,
    DROP COLUMN `invoice_tag`,
    DROP COLUMN `notes`,
    DROP COLUMN `order_id`,
    DROP COLUMN `type`,
    DROP COLUMN `vehicle_id`,
    DROP COLUMN `work_order_id`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `priority` ENUM('Low', 'Medium', 'High') NOT NULL;

-- AlterTable
ALTER TABLE `taskuser` MODIFY `eventId` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `date` DATETIME(3) NULL,
    `start_time` VARCHAR(191) NULL,
    `end_time` VARCHAR(191) NULL,
    `company_id` INTEGER NULL,
    `work_order_id` INTEGER NULL,
    `customer_id` INTEGER NULL,
    `vehicle_id` INTEGER NULL,
    `order_id` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `invoice_tag` VARCHAR(191) NULL,

    INDEX `fk_tasks_user`(`user_id`),
    INDEX `fk_tasks_company`(`company_id`),
    INDEX `fk_tasks_work_order`(`work_order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppointmentUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appointment_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `eventId` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `WorkOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppointmentUser` ADD CONSTRAINT `AppointmentUser_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppointmentUser` ADD CONSTRAINT `AppointmentUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
