-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `confirmation_email_template_id` INTEGER NULL,
    ADD COLUMN `reminder_email_template_id` INTEGER NULL,
    ADD COLUMN `times` JSON NULL;

-- AlterTable
ALTER TABLE `emailtemplate` MODIFY `message` VARCHAR(191) NULL;
