/*
  Warnings:

  - Added the required column `user_id` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `group` ADD COLUMN `user_id` INTEGER NOT NULL;
