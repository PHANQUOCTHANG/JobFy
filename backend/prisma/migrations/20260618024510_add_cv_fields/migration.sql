-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "personal_data" JSONB,
ADD COLUMN     "template_id" VARCHAR(100);

-- AlterTable
ALTER TABLE "skill_categories" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort_order" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort_order" SMALLINT NOT NULL DEFAULT 0;
