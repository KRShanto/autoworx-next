/*
  Warnings:

  - Made the column `company_id` on table `appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `setting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_work_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointmentuser` DROP FOREIGN KEY `AppointmentUser_appointment_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointmentuser` DROP FOREIGN KEY `AppointmentUser_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `calendarsettings` DROP FOREIGN KEY `CalendarSettings_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceadditional` DROP FOREIGN KEY `InvoiceAdditional_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `oauthtoken` DROP FOREIGN KEY `OAuthToken_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `setting` DROP FOREIGN KEY `Setting_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `vehicle` DROP FOREIGN KEY `Vehicle_company_id_fkey`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `customer` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `invoice` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `setting` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `company_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OAuthToken` ADD CONSTRAINT `OAuthToken_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceAdditional` ADD CONSTRAINT `InvoiceAdditional_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarSettings` ADD CONSTRAINT `CalendarSettings_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `WorkOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppointmentUser` ADD CONSTRAINT `AppointmentUser_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppointmentUser` ADD CONSTRAINT `AppointmentUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
