/*
  Warnings:

  - Added the required column `group_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `group_id` INTEGER NOT NULL;
