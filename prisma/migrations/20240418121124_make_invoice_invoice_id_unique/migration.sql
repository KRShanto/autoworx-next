/*
  Warnings:

  - A unique constraint covering the columns `[invoice_id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invoice_invoice_id_key` ON `Invoice`(`invoice_id`);
