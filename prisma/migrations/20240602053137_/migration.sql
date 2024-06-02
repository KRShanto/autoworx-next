-- DropForeignKey
ALTER TABLE `otherpayment` DROP FOREIGN KEY `OtherPayment_paymentMethodId_fkey`;

-- AlterTable
ALTER TABLE `cardpayment` MODIFY `creditCard` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `cashpayment` MODIFY `receivedCash` DOUBLE NULL;

-- AlterTable
ALTER TABLE `checkpayment` MODIFY `checkNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `otherpayment` MODIFY `paymentMethodId` INTEGER NULL,
    MODIFY `amount` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `OtherPayment` ADD CONSTRAINT `OtherPayment_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
