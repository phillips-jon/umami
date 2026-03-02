-- AlterTable
ALTER TABLE "link" ADD COLUMN     "custom_domain_id" UUID;

-- CreateTable
CREATE TABLE "custom_domain" (
    "custom_domain_id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "domain" VARCHAR(253) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "custom_domain_pkey" PRIMARY KEY ("custom_domain_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_domain_custom_domain_id_key" ON "custom_domain"("custom_domain_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_domain_domain_key" ON "custom_domain"("domain");

-- CreateIndex
CREATE INDEX "custom_domain_website_id_idx" ON "custom_domain"("website_id");

-- CreateIndex
CREATE INDEX "link_custom_domain_id_idx" ON "link"("custom_domain_id");
