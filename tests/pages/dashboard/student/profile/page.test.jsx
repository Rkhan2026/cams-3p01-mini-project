import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Mock child components
const BackButton = () => <div>BackButton</div>;
const PersonalInfoSection = ({ student }) => (
  <div>PersonalInfo: {student.name}</div>
);
const AcademicRecordsSection = ({ academicRecords }) => (
  <div>AcademicRecords: {academicRecords.courseEnrolled}</div>
);

// Mocked StudentProfile component
const StudentProfile = ({ student }) => (
  <div>
    <h1>Student Profile</h1>
    <BackButton />
    <PersonalInfoSection student={student} />
    <AcademicRecordsSection academicRecords={student.academicRecords} />
  </div>
);

describe("StudentProfile render test", () => {
  it("renders mocked student data", () => {
    const mockStudent = {
      id: 1,
      name: "Jane Doe",
      academicRecords: { courseEnrolled: "Math" },
    };

    const { container } = render(<StudentProfile student={mockStudent} />);

    expect(container.textContent).toContain("Student Profile");
    expect(container.textContent).toContain("BackButton");
    expect(container.textContent).toContain("PersonalInfo: Jane Doe");
    expect(container.textContent).toContain("AcademicRecords: Math");
  });
});
