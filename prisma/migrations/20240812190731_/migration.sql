/*
  Warnings:

  - You are about to drop the column `created_at` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `group` table. All the data in the column will be lost.
  - You are about to drop the `groupuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `groupuser` DROP FOREIGN KEY `GroupUser_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `groupuser` DROP FOREIGN KEY `GroupUser_userId_fkey`;

-- AlterTable
ALTER TABLE `group` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- DropTable
DROP TABLE `groupuser`;

-- CreateTable
CREATE TABLE `_UserGroups` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserGroups_AB_unique`(`A`, `B`),
    INDEX `_UserGroups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserGroups` ADD CONSTRAINT `_UserGroups_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserGroups` ADD CONSTRAINT `_UserGroups_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
