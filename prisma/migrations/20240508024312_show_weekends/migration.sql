/*
  Warnings:

  - You are about to drop the column `weekends` on the `calendarsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `calendarsettings` DROP COLUMN `weekends`,
    ADD COLUMN `weekend1` VARCHAR(191) NOT NULL DEFAULT 'Saturday',
    ADD COLUMN `weekend2` VARCHAR(191) NOT NULL DEFAULT 'Sunday';
