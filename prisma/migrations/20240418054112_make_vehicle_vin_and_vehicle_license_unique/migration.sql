/*
  Warnings:

  - A unique constraint covering the columns `[vin]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[license]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_vin_key` ON `Vehicle`(`vin`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_license_key` ON `Vehicle`(`license`);
