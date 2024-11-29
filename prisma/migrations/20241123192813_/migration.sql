/*
  Warnings:

  - You are about to alter the column `status` on the `coupon` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(9))`.
  - You are about to drop the column `add_to_canned_labor` on the `labor` table. All the data in the column will be lost.
  - You are about to alter the column `commission` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - A unique constraint covering the columns `[zapierToken]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[request_estimate_id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[request_estimate_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `InventoryProductHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cardpayment` DROP FOREIGN KEY `CardPayment_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `cashpayment` DROP FOREIGN KEY `CashPayment_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `checkpayment` DROP FOREIGN KEY `CheckPayment_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `otherpayment` DROP FOREIGN KEY `OtherPayment_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `otherpayment` DROP FOREIGN KEY `OtherPayment_paymentMethodId_fkey`;

-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `googleEventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `from_request` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `from_requested_company_id` INTEGER NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `column` ADD COLUMN `bgColor` VARCHAR(191) NULL,
    ADD COLUMN `company_id` INTEGER NOT NULL,
    ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `textColor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `company` ADD COLUMN `address_visibility` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `business_visibility` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `companyLatitude` DOUBLE NULL,
    ADD COLUMN `companyLongitude` DOUBLE NULL,
    ADD COLUMN `currency` VARCHAR(191) NULL DEFAULT 'USD',
    ADD COLUMN `google_refresh_token` VARCHAR(191) NULL,
    ADD COLUMN `phone_visibility` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `policy` VARCHAR(191) NULL,
    ADD COLUMN `tax` DECIMAL(65, 30) NULL DEFAULT 0,
    ADD COLUMN `terms` VARCHAR(191) NULL,
    ADD COLUMN `zapierToken` VARCHAR(240) NULL,
    MODIFY `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `coupon` MODIFY `status` ENUM('Active', 'Expired') NOT NULL;

-- AlterTable
ALTER TABLE `inventoryproducthistory` ADD COLUMN `company_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `assigned_to` INTEGER NULL,
    ADD COLUMN `column_id` INTEGER NULL,
    ADD COLUMN `from_request` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `from_requested_company_id` INTEGER NULL,
    ADD COLUMN `profit` INTEGER NULL DEFAULT 0,
    ADD COLUMN `request_estimate_id` INTEGER NULL,
    MODIFY `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `labor` DROP COLUMN `add_to_canned_labor`,
    ADD COLUMN `canned_labor` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `request_estimate_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `from_request` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `from_requested_company_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `client_id` INTEGER NULL,
    ADD COLUMN `googleEventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `commission` DECIMAL(10, 3) NULL DEFAULT 0,
    MODIFY `employeeType` ENUM('Admin', 'Manager', 'Sales', 'Technician', 'Other') NOT NULL DEFAULT 'Admin';

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `from_request` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `from_requested_company_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `ClientCoupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coupon_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyJoin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyOneId` INTEGER NOT NULL,
    `companyTwoId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holiday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_name` VARCHAR(191) NOT NULL,
    `client_email` VARCHAR(191) NULL,
    `client_phone` VARCHAR(191) NULL,
    `vehicle_info` VARCHAR(191) NOT NULL,
    `services` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NULL,
    `company_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `company_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companyEmailTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NULL,
    `company_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL DEFAULT 'notification',
    `notifications` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NotificationSettings_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryProductTag` (
    `inventory_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`inventory_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceTags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` VARCHAR(191) NOT NULL,
    `tag_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_invoice_tags_invoice`(`invoice_id`),
    INDEX `fk_invoice_tags_tag`(`tag_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestEstimate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `sender_company_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `receiver_company_id` INTEGER NOT NULL,
    `vehicle_id` INTEGER NOT NULL,
    `service_id` INTEGER NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RequestEstimate_vehicle_id_key`(`vehicle_id`),
    UNIQUE INDEX `RequestEstimate_service_id_key`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceRedo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` VARCHAR(191) NOT NULL,
    `service_id` INTEGER NOT NULL,
    `technician_id` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` VARCHAR(191) NOT NULL,
    `messageId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionForManager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `communication_hub_internal` BOOLEAN NOT NULL DEFAULT true,
    `communication_hub_clients` BOOLEAN NOT NULL DEFAULT true,
    `communication_hub_collaboration` BOOLEAN NOT NULL DEFAULT true,
    `estimates_invoices` BOOLEAN NOT NULL DEFAULT true,
    `calendar_task` BOOLEAN NOT NULL DEFAULT true,
    `payments` BOOLEAN NOT NULL DEFAULT true,
    `workforce_management` BOOLEAN NOT NULL DEFAULT true,
    `reporting` BOOLEAN NOT NULL DEFAULT true,
    `inventory` BOOLEAN NOT NULL DEFAULT true,
    `integrations` BOOLEAN NOT NULL DEFAULT false,
    `sales_pipeline` BOOLEAN NOT NULL DEFAULT true,
    `shop_pipeline` BOOLEAN NOT NULL DEFAULT true,
    `business_settings` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionForSales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `communication_hub_internal` BOOLEAN NOT NULL DEFAULT true,
    `communication_hub_clients` BOOLEAN NOT NULL DEFAULT true,
    `communication_hub_collaboration` BOOLEAN NOT NULL DEFAULT true,
    `estimates_invoices` BOOLEAN NOT NULL DEFAULT true,
    `calendar_task` BOOLEAN NOT NULL DEFAULT true,
    `payments` BOOLEAN NOT NULL DEFAULT false,
    `sales_pipeline` BOOLEAN NOT NULL DEFAULT true,
    `workforce_management` BOOLEAN NOT NULL DEFAULT true,
    `reportingViewOnly` BOOLEAN NOT NULL DEFAULT true,
    `inventoryViewOnly` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionForTechnician` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `communication_hub_internal` BOOLEAN NOT NULL DEFAULT true,
    `calendar_task` BOOLEAN NOT NULL DEFAULT true,
    `shop_pipeline` BOOLEAN NOT NULL DEFAULT true,
    `workforce_management` BOOLEAN NOT NULL DEFAULT true,
    `reportingViewOnly` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionForOther` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `communication_hub_internal` BOOLEAN NOT NULL DEFAULT false,
    `communication_hub_clients` BOOLEAN NOT NULL DEFAULT false,
    `communication_hub_collaboration` BOOLEAN NOT NULL DEFAULT false,
    `estimates_invoices` BOOLEAN NOT NULL DEFAULT false,
    `calendar_task` BOOLEAN NOT NULL DEFAULT false,
    `payments` BOOLEAN NOT NULL DEFAULT false,
    `workforce_management` BOOLEAN NOT NULL DEFAULT false,
    `reporting` BOOLEAN NOT NULL DEFAULT false,
    `inventory` BOOLEAN NOT NULL DEFAULT false,
    `integrations` BOOLEAN NOT NULL DEFAULT false,
    `sales_pipeline` BOOLEAN NOT NULL DEFAULT false,
    `shop_pipeline` BOOLEAN NOT NULL DEFAULT false,
    `business_settings` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,
    `communication_hub_internal` BOOLEAN NOT NULL DEFAULT false,
    `communication_hub_clients` BOOLEAN NOT NULL DEFAULT false,
    `communication_hub_collaboration` BOOLEAN NOT NULL DEFAULT false,
    `estimates_invoices` BOOLEAN NOT NULL DEFAULT false,
    `calendar_task` BOOLEAN NOT NULL DEFAULT false,
    `payments` BOOLEAN NOT NULL DEFAULT false,
    `workforce_management` BOOLEAN NOT NULL DEFAULT false,
    `reporting` BOOLEAN NOT NULL DEFAULT false,
    `inventory` BOOLEAN NOT NULL DEFAULT false,
    `integrations` BOOLEAN NOT NULL DEFAULT false,
    `sales_pipeline` BOOLEAN NOT NULL DEFAULT false,
    `shop_pipeline` BOOLEAN NOT NULL DEFAULT false,
    `business_settings` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Permission_user_id_company_id_key`(`user_id`, `company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClockInOut` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,
    `clock_in` DATETIME(3) NOT NULL,
    `clock_out` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_clock_in_out_user`(`user_id`),
    INDEX `fk_clock_in_out_company`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClockBreak` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clock_in_out_id` INTEGER NOT NULL,
    `break_start` DATETIME(3) NOT NULL,
    `break_end` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_clock_break_clock_in_out`(`clock_in_out_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Company_zapierToken_key` ON `Company`(`zapierToken`);

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_request_estimate_id_key` ON `Invoice`(`request_estimate_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Message_request_estimate_id_key` ON `Message`(`request_estimate_id`);

-- AddForeignKey
ALTER TABLE `ClientCoupon` ADD CONSTRAINT `ClientCoupon_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCoupon` ADD CONSTRAINT `ClientCoupon_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyJoin` ADD CONSTRAINT `CompanyJoin_companyOneId_fkey` FOREIGN KEY (`companyOneId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyJoin` ADD CONSTRAINT `CompanyJoin_companyTwoId_fkey` FOREIGN KEY (`companyTwoId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holiday` ADD CONSTRAINT `Holiday_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `companyEmailTemplate` ADD CONSTRAINT `companyEmailTemplate_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryProductTag` ADD CONSTRAINT `InventoryProductTag_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `InventoryProduct`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryProductTag` ADD CONSTRAINT `InventoryProductTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryProductHistory` ADD CONSTRAINT `InventoryProductHistory_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_request_estimate_id_fkey` FOREIGN KEY (`request_estimate_id`) REFERENCES `RequestEstimate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_column_id_fkey` FOREIGN KEY (`column_id`) REFERENCES `Column`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceTags` ADD CONSTRAINT `InvoiceTags_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceTags` ADD CONSTRAINT `InvoiceTags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_sender_company_id_fkey` FOREIGN KEY (`sender_company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_receiver_company_id_fkey` FOREIGN KEY (`receiver_company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestEstimate` ADD CONSTRAINT `RequestEstimate_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceRedo` ADD CONSTRAINT `InvoiceRedo_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceRedo` ADD CONSTRAINT `InvoiceRedo_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceRedo` ADD CONSTRAINT `InvoiceRedo_technician_id_fkey` FOREIGN KEY (`technician_id`) REFERENCES `Technician`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_request_estimate_id_fkey` FOREIGN KEY (`request_estimate_id`) REFERENCES `RequestEstimate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardPayment` ADD CONSTRAINT `CardPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CheckPayment` ADD CONSTRAINT `CheckPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashPayment` ADD CONSTRAINT `CashPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherPayment` ADD CONSTRAINT `OtherPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherPayment` ADD CONSTRAINT `OtherPayment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionForManager` ADD CONSTRAINT `PermissionForManager_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionForSales` ADD CONSTRAINT `PermissionForSales_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionForTechnician` ADD CONSTRAINT `PermissionForTechnician_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionForOther` ADD CONSTRAINT `PermissionForOther_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClockInOut` ADD CONSTRAINT `ClockInOut_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClockInOut` ADD CONSTRAINT `ClockInOut_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClockBreak` ADD CONSTRAINT `ClockBreak_clock_in_out_id_fkey` FOREIGN KEY (`clock_in_out_id`) REFERENCES `ClockInOut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
