import FormField from "./FormField";
import Button from "@/components/ui/Button";

export default function StudentFormFields() {
  return (
    <div className="space-y-8">
      {/* Section 1: Account Credentials */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 w-full">
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            required
          />
        </div>
      </div>

      {/* Section 2: Academic Profile with Blue Background */}
      <div className="space-y-4 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-300 pb-2 w-full">
          Academic Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FormField
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            required
          />
          <FormField
            name="enrollmentNo"
            label="Enrollment Number"
            placeholder="e.g., GI1234"
            required
          />
          <FormField
            name="facultyNo"
            label="Faculty Number"
            placeholder="e.g., 20COB123"
          />
          <FormField
            name="courseEnrolled"
            label="Course Enrolled"
            placeholder="e.g., B.Tech CSE"
          />
          <FormField
            name="college"
            label="College/University"
            placeholder="Your college name"
          />
          <FormField
            name="currentYearSemester"
            label="Current Year/Semester"
            placeholder="e.g., 4th Year, 7th Sem"
          />
          <FormField
            name="classXPercentage"
            label="Class X %"
            type="number"
            step="0.01"
            placeholder="e.g., 85.5"
          />
          <FormField
            name="classXIIPercentage"
            label="Class XII %"
            type="number"
            step="0.01"
            placeholder="e.g., 90.2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="currentCGPA"
            label="Current CGPA"
            type="number"
            placeholder="e.g., 8.5"
            step="0.01"
          />
          <FormField
            name="resumeLink"
            label="Resume Link"
            type="url"
            placeholder="https://your-resume-link.com"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
