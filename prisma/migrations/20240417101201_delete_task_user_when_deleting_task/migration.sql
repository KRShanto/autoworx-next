-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `taskuser` DROP FOREIGN KEY `TaskUser_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
