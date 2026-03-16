-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fee` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `minAdvanceMinutes` INTEGER NOT NULL,
    `maxAdvanceDays` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(1000) NULL,
    `refreshToken` VARCHAR(1000) NULL,
    `expiryDate` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SessionType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `sub` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `fee` INTEGER NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,

    INDEX `SessionType_doctorId_idx`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `sessionTypeId` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` INTEGER NOT NULL,
    `endTime` INTEGER NOT NULL,
    `googleCalendarEventId` VARCHAR(191) NULL,
    `meetLink` VARCHAR(191) NULL,
    `status` ENUM('CONFIRMED', 'PENDING', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Appointment_doctorId_date_idx`(`doctorId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorBlock` (
    `id` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` INTEGER NOT NULL,
    `endTime` INTEGER NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DoctorBlock_doctorId_date_idx`(`doctorId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `txnId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `method` VARCHAR(191) NULL,
    `error` VARCHAR(191) NULL,
    `appointmentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payment_txnId_key`(`txnId`),
    UNIQUE INDEX `Payment_appointmentId_key`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationLog` (
    `id` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NOT NULL,
    `type` ENUM('INSTANT', 'ONE_DAY_BEFORE', 'TWO_HOURS_BEFORE') NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationLog_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SessionType` ADD CONSTRAINT `SessionType_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_sessionTypeId_fkey` FOREIGN KEY (`sessionTypeId`) REFERENCES `SessionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorBlock` ADD CONSTRAINT `DoctorBlock_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
