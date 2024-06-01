/*
  Warnings:

  - You are about to drop the column `tags` on the `labor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `labor` DROP COLUMN `tags`;

-- CreateTable
CREATE TABLE `LaborTag` (
    `labor_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`labor_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaborTag` ADD CONSTRAINT `LaborTag_labor_id_fkey` FOREIGN KEY (`labor_id`) REFERENCES `Labor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaborTag` ADD CONSTRAINT `LaborTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
