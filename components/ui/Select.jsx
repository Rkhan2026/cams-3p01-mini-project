export default function Select(props) {
  return (
    <select
      {...props}
      className={`w-full border rounded-md p-2 ${props.className || ""}`}
    />
  );
}


