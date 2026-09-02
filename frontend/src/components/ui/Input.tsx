import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input className={`w-full border rounded px-3 py-2 ${className}`} {...props} />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}