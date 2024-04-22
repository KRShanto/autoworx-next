-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `tags` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `task` ADD COLUMN `invoice_tag` VARCHAR(191) NULL;
