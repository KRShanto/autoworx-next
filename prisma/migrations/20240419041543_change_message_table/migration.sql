/*
  Warnings:

  - You are about to drop the column `user_id` on the `message` table. All the data in the column will be lost.
  - You are about to alter the column `from` on the `message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `to` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `fk_messages_user` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `user_id`,
    ADD COLUMN `to` INTEGER NOT NULL,
    MODIFY `from` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `fk_messages_to` ON `Message`(`to`);

-- CreateIndex
CREATE INDEX `fk_messages_from` ON `Message`(`from`);
