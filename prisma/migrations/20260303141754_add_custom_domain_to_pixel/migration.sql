-- AlterTable
ALTER TABLE "pixel" ADD COLUMN     "custom_domain_id" UUID;

-- CreateIndex
CREATE INDEX "pixel_custom_domain_id_idx" ON "pixel"("custom_domain_id");
