/**
 * Shared layout component for authentication pages
 */

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showFooter = true,
  maxWidth = "max-w-md" 
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className={`w-full ${maxWidth}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        {showFooter && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}