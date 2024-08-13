-- CreateEnum
CREATE TYPE "FormState" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "state" "FormState" NOT NULL DEFAULT 'DRAFT';
