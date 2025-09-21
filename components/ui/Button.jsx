export default function Button({
  as: Tag = "button",
  className = "",
  variant = "default",
  ...props
}) {
  const variants = {
    default: "bg-black dark:bg-gray-800 text-white hover:opacity-90 dark:hover:bg-gray-700",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
    ghost: "hover:bg-neutral-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
  };
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-2 transition-all duration-200";
  return (
    <Tag
      className={className || `${base} ${variants[variant] || variants.default}`}
      {...props}
    />
  );
}


