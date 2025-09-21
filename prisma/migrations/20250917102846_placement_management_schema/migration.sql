/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Test";

-- CreateTable
CREATE TABLE "public"."Student" (
    "Student_ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Faculty_No" TEXT,
    "Enrollment_No" TEXT,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Academic_Records" JSONB,
    "Account_Status" TEXT NOT NULL DEFAULT 'PENDING_STUDENT',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Student_ID")
);

-- CreateTable
CREATE TABLE "public"."CompanyRecruiter" (
    "Recruiter_ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Company_Profile" TEXT,
    "Account_Status" TEXT NOT NULL DEFAULT 'PENDING_RECRUITER',

    CONSTRAINT "CompanyRecruiter_pkey" PRIMARY KEY ("Recruiter_ID")
);

-- CreateTable
CREATE TABLE "public"."TpoAdmin" (
    "TPO_ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" TEXT NOT NULL DEFAULT 'TPO_ADMIN',

    CONSTRAINT "TpoAdmin_pkey" PRIMARY KEY ("TPO_ID")
);

-- CreateTable
CREATE TABLE "public"."JobPosting" (
    "Job_ID" TEXT NOT NULL,
    "Recruiter_ID" TEXT NOT NULL,
    "Eligibility_Criteria" TEXT,
    "Job_Description" TEXT NOT NULL,
    "Application_Deadline" TIMESTAMP(3) NOT NULL,
    "Approval_Status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("Job_ID")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "Application_ID" TEXT NOT NULL,
    "Job_ID" TEXT NOT NULL,
    "Student_ID" TEXT NOT NULL,
    "Application_Status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("Application_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_Email_key" ON "public"."Student"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRecruiter_Email_key" ON "public"."CompanyRecruiter"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "TpoAdmin_Email_key" ON "public"."TpoAdmin"("Email");

-- AddForeignKey
ALTER TABLE "public"."JobPosting" ADD CONSTRAINT "JobPosting_Recruiter_ID_fkey" FOREIGN KEY ("Recruiter_ID") REFERENCES "public"."CompanyRecruiter"("Recruiter_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_Job_ID_fkey" FOREIGN KEY ("Job_ID") REFERENCES "public"."JobPosting"("Job_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_Student_ID_fkey" FOREIGN KEY ("Student_ID") REFERENCES "public"."Student"("Student_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
