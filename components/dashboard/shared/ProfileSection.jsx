export default function ProfileSection({ title, children, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
        {title}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}