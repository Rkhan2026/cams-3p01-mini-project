import Image from "next/image";

export default function Logo({ className = "", width = 120, height = 57 }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/Logo.jpg"
        alt="PlacementConnect"
        width={width}
        height={height}
        priority
        className="h-auto"
      />
    </div>
  );
}