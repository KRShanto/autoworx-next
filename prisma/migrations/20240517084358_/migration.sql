/*
  Warnings:

  - You are about to drop the column `tags` on the `service` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service` DROP COLUMN `tags`;

-- AlterTable
ALTER TABLE `tag` ADD COLUMN `service_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
