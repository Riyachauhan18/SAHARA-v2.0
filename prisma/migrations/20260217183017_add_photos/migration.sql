-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hospital" (
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
    "description" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_Hospital" ("address", "description", "district", "email", "facilities", "id", "image", "is_active", "last_updated_at", "latitude", "longitude", "name", "phone_emergency", "type", "website") SELECT "address", "description", "district", "email", "facilities", "id", "image", "is_active", "last_updated_at", "latitude", "longitude", "name", "phone_emergency", "type", "website" FROM "Hospital";
DROP TABLE "Hospital";
ALTER TABLE "new_Hospital" RENAME TO "Hospital";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
