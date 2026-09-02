import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const variantMap: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border text-gray-700 hover:bg-gray-50",
  danger: "border border-red-300 text-red-600 hover:bg-red-50",
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded disabled:opacity-50 ${variantMap[variant]} ${className}`}
      {...props}
    />
  );
}