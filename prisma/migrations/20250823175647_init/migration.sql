-- CreateTable
CREATE TABLE "public"."test" (
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "test_name_key" ON "public"."test"("name");
