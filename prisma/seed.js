import bcrypt from "bcryptjs";

// Import the generated Prisma client directly so the seed script runs under plain Node
// without requiring Next's path-alias resolution. This keeps `lib/prisma.js` untouched.
import * as genPrisma from "../app/generated/prisma/index.js";
const prismaModule = genPrisma.default || genPrisma;
const PrismaClient =
  prismaModule.PrismaClient || prismaModule.getPrismaClient?.() || prismaModule;
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed script...");

  const defaultPassword = "123456";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Create a few recruiters using the provided email pattern (start after index 1)
  const numRecruiters = 3;
  const recruiters = [];
  const companyNames = [
    "Infosys",
    "TCS",
    "Google India",
    "Microsoft India",
    "Cognizant",
  ];
  for (let i = 2; i <= numRecruiters; i++) {
    const companyName = companyNames[(i - 2) % companyNames.length];
    // Use upsert so running the seed multiple times won't create duplicates
    const r = await prisma.companyRecruiter.upsert({
      where: { email: `testrecruiter${i}@sharklasers.com` },
      update: {
        name: `Test Recruiter ${i}`,
        passwordHash,
        companyProfile: `${companyName} - A leading company in technology and consulting with a focus on engineering excellence and large-scale enterprise solutions.`,
      },
      create: {
        name: `Test Recruiter ${i}`,
        email: `testrecruiter${i}@sharklasers.com`,
        passwordHash,
        companyProfile: `${companyName} - A leading company in technology and consulting with a focus on engineering excellence and large-scale enterprise solutions.`,
      },
    });
    recruiters.push(r);
  }

  // Create students using the provided email pattern (start after index 1)
  const numStudents = 8;
  const students = [];
  for (let i = 2; i <= numStudents; i++) {
    // Upsert student by email so seed is idempotent
    const s = await prisma.student.upsert({
      where: { email: `teststudent${i}@sharklasers.com` },
      update: {
        name: `Test Student ${i}`,
        passwordHash,
        facultyNo: `F-${1000 + i}`,
        enrollmentNo: `E-${2000 + i}`,
        academicRecords: {
          college: "Aligarh Muslim University",
          resumeLink: `https://example.com/resume/teststudent${i}.pdf`,
          currentCgpa: parseFloat((6 + Math.random() * 3).toFixed(2)),
          courseEnrolled: "B.Tech Computer Science",
          classXPercentage: parseFloat((75 + Math.random() * 20).toFixed(2)),
          classXIIPercentage: parseFloat((70 + Math.random() * 25).toFixed(2)),
          currentYearSemester: `${Math.ceil(Math.random() * 8)}th Semester`,
        },
      },
      create: {
        name: `Test Student ${i}`,
        email: `teststudent${i}@sharklasers.com`,
        passwordHash,
        facultyNo: `F-${1000 + i}`,
        enrollmentNo: `E-${2000 + i}`,
        academicRecords: {
          college: "Aligarh Muslim University",
          resumeLink: `https://example.com/resume/teststudent${i}.pdf`,
          currentCgpa: parseFloat((6 + Math.random() * 3).toFixed(2)),
          courseEnrolled: "B.Tech Computer Science",
          classXPercentage: parseFloat((75 + Math.random() * 20).toFixed(2)),
          classXIIPercentage: parseFloat((70 + Math.random() * 25).toFixed(2)),
          currentYearSemester: `${Math.ceil(Math.random() * 8)}th Semester`,
        },
      },
    });
    students.push(s);
  }

  // Create job postings for each recruiter
  const jobs = [];
  const jobsPerRecruiter = 2;

  // Job templates to produce varied titles, descriptions and salary text
  const jobTemplates = [
    {
      title: "Software Engineer",
      responsibilities: [
        "Design and implement backend services",
        "Write unit and integration tests",
        "Work with product and design teams",
      ],
      baseSalary: 500000,
    },
    {
      title: "Frontend Developer",
      responsibilities: [
        "Implement responsive UI",
        "Optimize web performance",
        "Collaborate on UX improvements",
      ],
      baseSalary: 400000,
    },
    {
      title: "Data Analyst",
      responsibilities: [
        "Analyze datasets to uncover insights",
        "Build dashboards and reports",
        "Support data-driven decision making",
      ],
      baseSalary: 350000,
    },
    {
      title: "DevOps Engineer",
      responsibilities: [
        "Maintain CI/CD pipelines",
        "Manage cloud infrastructure",
        "Improve system reliability",
      ],
      baseSalary: 550000,
    },
    {
      title: "QA Engineer",
      responsibilities: [
        "Design test plans and automation",
        "Perform regression testing",
        "Work with developers to triage bugs",
      ],
      baseSalary: 320000,
    },
  ];

  for (const [ri, rec] of recruiters.entries()) {
    for (let j = 1; j <= jobsPerRecruiter; j++) {
      // rotate through templates
      const tmpl =
        jobTemplates[(ri * jobsPerRecruiter + j - 1) % jobTemplates.length];
      const variability = (ri + j) * 0.05; // small increase per recruiter/job
      const salary = Math.round(tmpl.baseSalary * (1 + variability));
      const jobDescription = `${tmpl.title} at ${
        rec.name
      }. CTC: ₹${salary.toLocaleString(
        "en-IN"
      )} per annum. Responsibilities: ${tmpl.responsibilities.join("; ")}.`;

      // Only create the job if a job with same recruiter and jobDescription doesn't already exist
      let job = await prisma.jobPosting.findFirst({
        where: {
          recruiterId: rec.id,
          jobDescription,
        },
      });
      if (!job) {
        job = await prisma.jobPosting.create({
          data: {
            recruiterId: rec.id,
            jobDescription,
            eligibilityCriteria: `B.Tech with minimum 6.0 CGPA or equivalent experience. Role index ${
              ri + 1
            }-${j}`,
            applicationDeadline: new Date(
              Date.now() + (7 + j) * 24 * 60 * 60 * 1000
            ),
            approvalStatus: j === 1 ? "APPROVED" : undefined,
          },
        });
      }
      jobs.push(job);
    }
  }

  // Create applications: each student applies to 1-3 random jobs
  const applications = [];
  for (const student of students) {
    const applicationsCount = 1 + Math.floor(Math.random() * 3); // 1..3
    const appliedIndexes = new Set();
    while (appliedIndexes.size < applicationsCount) {
      const idx = Math.floor(Math.random() * jobs.length);
      appliedIndexes.add(idx);
    }

    for (const idx of appliedIndexes) {
      const job = jobs[idx];
      // create application only if not already present for that job+student
      let app = await prisma.application.findFirst({
        where: {
          jobId: job.id,
          studentId: student.id,
        },
      });
      if (!app) {
        app = await prisma.application.create({
          data: {
            jobId: job.id,
            studentId: student.id,
            // randomly approve a few
            applicationStatus: Math.random() > 0.85 ? "APPROVED" : undefined,
          },
        });
      }
      applications.push(app);
    }
  }

  console.log(
    `Seeded ${recruiters.length} recruiters, ${students.length} students, ${jobs.length} jobs and ${applications.length} applications.`
  );
  console.log("Default password for seeded users:", defaultPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding finished.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
