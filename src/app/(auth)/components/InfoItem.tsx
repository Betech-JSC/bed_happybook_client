export default function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-gray-600 font-bold">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
