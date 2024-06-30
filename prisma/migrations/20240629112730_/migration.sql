/*
  Warnings:

  - The primary key for the `itemtag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `service_id` on the `itemtag` table. All the data in the column will be lost.
  - You are about to drop the column `tag_id` on the `itemtag` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `ItemTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `ItemTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `itemtag` DROP FOREIGN KEY `ItemTag_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `itemtag` DROP FOREIGN KEY `ItemTag_tag_id_fkey`;

-- AlterTable
ALTER TABLE `itemtag` DROP PRIMARY KEY,
    DROP COLUMN `service_id`,
    DROP COLUMN `tag_id`,
    ADD COLUMN `itemId` INTEGER NOT NULL,
    ADD COLUMN `tagId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`itemId`, `tagId`);

-- AddForeignKey
ALTER TABLE `ItemTag` ADD CONSTRAINT `ItemTag_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `InvoiceItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTag` ADD CONSTRAINT `ItemTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
