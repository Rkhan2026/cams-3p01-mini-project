/**
 * ApplicationFilters Component
 * 
 * Provides job dropdown filtering functionality for applications.
 * Maintains existing select styling and handles job selection changes.
 */

const ApplicationFilters = ({ jobs, selectedJob, onJobChange }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-xl border">
      <label
        htmlFor="job-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filter by Job Posting
      </label>
      <select
        id="job-filter"
        value={selectedJob}
        onChange={onJobChange}
        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
      >
        <option value="ALL">All Jobs</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title || `Job #${job.id.slice(-6)}`} - {job.recruiter.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ApplicationFilters;