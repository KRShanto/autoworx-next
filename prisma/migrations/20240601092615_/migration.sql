/*
  Warnings:

  - You are about to drop the column `tags` on the `material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `material` DROP COLUMN `tags`;

-- CreateTable
CREATE TABLE `MaterialTag` (
    `material_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`material_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaterialTag` ADD CONSTRAINT `MaterialTag_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialTag` ADD CONSTRAINT `MaterialTag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
