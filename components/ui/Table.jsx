export function Table({ className = "", ...props }) {
  return <table className={`w-full text-sm ${className}`} {...props} />;
}
export function THead(props) {
  return <thead {...props} />;
}
export function TBody(props) {
  return <tbody {...props} />;
}
export function TR(props) {
  return <tr {...props} />;
}
export function TH({ className = "", ...props }) {
  return <th className={`text-left p-2 border ${className}`} {...props} />;
}
export function TD({ className = "", ...props }) {
  return <td className={`p-2 border ${className}`} {...props} />;
}


