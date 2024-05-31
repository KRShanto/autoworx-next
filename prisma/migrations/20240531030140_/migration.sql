-- DropIndex
DROP INDEX `Customer_mobile_key` ON `Customer`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `mobile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Vendor` MODIFY `phone` VARCHAR(191) NULL;
