-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('UNKNOWN', 'TEXT', 'MARKDOWN', 'EPUB', 'PDF', 'SRT', 'URL');

-- CreateTable
CREATE TABLE "UserFile" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" "FileType" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "is_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMPTZ,
    "embedding_status" "EmbeddingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "embedding_started_at" TIMESTAMPTZ,
    "embedding_completed_at" TIMESTAMPTZ,
    "embedding_failed_at" TIMESTAMPTZ,
    "is_binary_file" BOOLEAN NOT NULL DEFAULT true,
    "file_extension" TEXT,
    "file_mime_type" TEXT,

    CONSTRAINT "UserFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_public_id_key" ON "UserFile"("public_id");

-- CreateIndex
CREATE INDEX "UserFile_public_id_idx" ON "UserFile"("public_id");
