export default function ApplicationProcessInfo({ showInfo }) {
  if (!showInfo) return null;

  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h4 className="font-semibold text-blue-900 mb-2">
        Application Process
      </h4>
      <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside" role="list">
        <li>
          Click &quot;Apply for this Job&quot; to submit your application.
        </li>
        <li>
          Your profile and academic records will be shared with the
          recruiter.
        </li>
        <li>
          You can track your status in the &quot;My Applications&quot;
          section.
        </li>
        <li>
          You will receive email notifications about any status updates.
        </li>
      </ul>
    </div>
  );
}