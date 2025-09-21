export default function Input(props) {
  const defaultClasses = "w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200";
  
  return (
    <input
      {...props}
      className={props.className || defaultClasses}
    />
  );
}


