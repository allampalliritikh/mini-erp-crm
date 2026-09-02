interface BadgeProps {
  text: string;
  color?: "gray" | "green" | "red" | "yellow" | "blue";
}

const colorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
};

export default function Badge({ text, color = "gray" }: BadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs rounded ${colorMap[color]}`}>
      {text}
    </span>
  );
}