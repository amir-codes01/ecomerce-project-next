"use client";

import api from "@/api/axios";
import DataTable from "@/components/tables/DataTable";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [data, setData] = useState([]);

  const columns = [
    { header: "Name", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  async function getUsers() {
    try {
      const res = await api.get("/users/");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsers();
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
