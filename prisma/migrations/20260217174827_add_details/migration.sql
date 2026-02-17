-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "hospital_id" TEXT,
    "blood_bank_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_blood_bank_id_fkey" FOREIGN KEY ("blood_bank_id") REFERENCES "BloodBank" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "address" TEXT,
    "phone_emergency" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_updated_at" DATETIME,
    "image" TEXT,
    "facilities" TEXT NOT NULL DEFAULT '[]',
    "type" TEXT NOT NULL DEFAULT 'Government',
    "website" TEXT,
    "email" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "BedInventory" (
    "hospital_id" TEXT NOT NULL PRIMARY KEY,
    "icu_total" INTEGER NOT NULL DEFAULT 0,
    "icu_available" INTEGER NOT NULL DEFAULT 0,
    "general_total" INTEGER NOT NULL DEFAULT 0,
    "general_available" INTEGER NOT NULL DEFAULT 0,
    "pediatric_total" INTEGER NOT NULL DEFAULT 0,
    "pediatric_available" INTEGER NOT NULL DEFAULT 0,
    "maternity_total" INTEGER NOT NULL DEFAULT 0,
    "maternity_available" INTEGER NOT NULL DEFAULT 0,
    "isolation_total" INTEGER NOT NULL DEFAULT 0,
    "isolation_available" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT,
    CONSTRAINT "BedInventory_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BedInventory_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BloodBank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "phone" TEXT,
    "last_updated_at" DATETIME,
    "image" TEXT,
    "website" TEXT,
    "email" TEXT,
    "operating_hours" TEXT
);

-- CreateTable
CREATE TABLE "BloodInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blood_bank_id" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "units_available" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" TEXT,
    CONSTRAINT "BloodInventory_blood_bank_id_fkey" FOREIGN KEY ("blood_bank_id") REFERENCES "BloodBank" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BloodInventory_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "performed_by_id" TEXT,
    "previous_value" TEXT,
    "new_value" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    CONSTRAINT "AuditLog_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BloodInventory_blood_bank_id_blood_group_key" ON "BloodInventory"("blood_bank_id", "blood_group");
