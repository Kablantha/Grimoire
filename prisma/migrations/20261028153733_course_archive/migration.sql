-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "archived_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "courses_user_id_archived_at_idx" ON "courses"("user_id", "archived_at");
