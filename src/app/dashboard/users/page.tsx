import DataTable from "@/components/tables/DataTable";

export default function UsersPage() {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const data = [
    { name: "John Doe", email: "john@email.com", role: "Admin" },
    { name: "Sarah", email: "sarah@email.com", role: "User" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
