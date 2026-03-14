interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
