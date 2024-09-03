/*
  Warnings:

  - Added the required column `image` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `business_id` VARCHAR(191) NULL,
    ADD COLUMN `business_type` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `industry` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL,
    ADD COLUMN `zip` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `work_order_status` VARCHAR(191) NULL DEFAULT 'Pending';
