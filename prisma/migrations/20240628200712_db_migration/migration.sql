-- CreateTable
CREATE TABLE "Animation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "version" TEXT,
    "revision" INTEGER,
    "keywords" TEXT,
    "author" TEXT,
    "generator" TEXT,
    "animationId" INTEGER NOT NULL,
    CONSTRAINT "Metadata_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "Animation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "metadata" TEXT,
    "content" TEXT NOT NULL,
    "animationId" INTEGER NOT NULL,
    CONSTRAINT "Content_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "Animation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_animationId_key" ON "Metadata"("animationId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_animationId_key" ON "Content"("animationId");
