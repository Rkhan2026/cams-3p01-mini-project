import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

export default function FormField({ name, label, type = "text", ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        className="text-black w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        {...props}
      />
    </div>
  );
}
