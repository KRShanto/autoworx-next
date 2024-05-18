-- DropForeignKey
ALTER TABLE `tag` DROP FOREIGN KEY `Tag_service_id_fkey`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `status`,
    ADD COLUMN `status_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tag` DROP COLUMN `color`,
    DROP COLUMN `service_id`,
    ADD COLUMN `hue` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `servicetag` (
    `service_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    INDEX `ServiceTag_tag_id_fkey`(`tag_id` ASC),
    PRIMARY KEY (`service_id` ASC, `tag_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `hue` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` INTEGER NOT NULL,

    INDEX `Status_company_id_fkey`(`company_id` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Invoice_status_id_fkey` ON `invoice`(`status_id` ASC);

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `Invoice_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicetag` ADD CONSTRAINT `ServiceTag_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicetag` ADD CONSTRAINT `ServiceTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status` ADD CONSTRAINT `Status_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

