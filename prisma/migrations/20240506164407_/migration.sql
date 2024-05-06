-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `confirmation_email_template_status` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `reminder_email_template_status` BOOLEAN NULL DEFAULT false;
