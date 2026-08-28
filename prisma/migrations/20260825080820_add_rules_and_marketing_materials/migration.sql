-- CreateTable
CREATE TABLE "enterprise_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enterpriseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "enterprise_rules_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rule_agreements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ruleId" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "agreedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rule_agreements_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "enterprise_rules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rule_agreements_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "marketing_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enterpriseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "marketing_materials_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "enterprise_rules_enterpriseId_idx" ON "enterprise_rules"("enterpriseId");

-- CreateIndex
CREATE UNIQUE INDEX "rule_agreements_ruleId_affiliateId_key" ON "rule_agreements"("ruleId", "affiliateId");

-- CreateIndex
CREATE INDEX "marketing_materials_enterpriseId_idx" ON "marketing_materials"("enterpriseId");
