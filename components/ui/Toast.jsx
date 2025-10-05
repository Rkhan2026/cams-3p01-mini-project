"use client";

import { useEffect, useState } from "react";

export default function Toast() {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const handler = (e) => setMessage(e.detail);
    window.addEventListener("toast", handler);
    const t = setTimeout(() => setMessage(null), 3000);
    return () => {
      window.removeEventListener("toast", handler);
      clearTimeout(t);
    };
  }, [message]);
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md text-sm shadow">
      {message}
    </div>
  );
}