import FormField from "./FormField";
import Button from "../../ui/Button";
export default function RecruiterFormFields() {
  return (
    <div>
      <div className="space-y-6 bg-green-50 rounded-xl p-6 border ">
        <h3 className="text-lg font-semibold text-green-900">
          Recruiter Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="email"
            label="Work Email Address"
            type="email"
            placeholder="you@company.com"
            required
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="name"
            label="Your Name"
            placeholder="e.g., Jane Doe"
            required
          />
          <FormField
            name="companyName"
            label="Company Name"
            placeholder="e.g., Acme Corp"
            required
          />
        </div>
        <div>
          <label
            htmlFor="companyProfile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Profile
          </label>
          <textarea
            id="companyProfile"
            name="companyProfile"
            placeholder="Describe your company..."
            className="text-black w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={4}
            required
          />
        </div>
      </div>
      {/* Submit Button */}
      <div className="pt-5">
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
