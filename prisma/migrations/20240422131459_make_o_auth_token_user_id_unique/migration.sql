/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OAuthToken_user_id_key` ON `OAuthToken`(`user_id`);
