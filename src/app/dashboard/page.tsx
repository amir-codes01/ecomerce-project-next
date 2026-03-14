import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,245" />
        <StatCard title="Total Orders" value="532" />
        <StatCard title="Products" value="89" />
      </div>
    </div>
  );
}
