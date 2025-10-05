/**
 * Hero section component for landing pages
 */

export default function HeroSection({ 
  title, 
  subtitle, 
  className = "" 
}) {
  return (
    <div className={`mb-16 text-center ${className}`}>
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}