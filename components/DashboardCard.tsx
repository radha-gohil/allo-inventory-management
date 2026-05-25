type DashboardCardProps = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-lg text-gray-500">
        {title}
      </h2>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}