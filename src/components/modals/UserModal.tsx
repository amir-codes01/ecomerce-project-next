"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/api/axios";
import { User } from "@/app/dashboard/users/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  currentUser: User | null;
  user?: User;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  currentUser,
  user,
}: Props) {
  const [form, setForm] = useState<User>({
    username: "",
    email: "",
    role: "user",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && user) {
      setForm(user);
    }
  }, [user, mode]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (mode === "create") {
        await api.post("/users", form);
        toast.success("User created");
      } else {
        await api.put(`/users/${user?._id}`, form);
        toast.success("User updated");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
              <h2 className="text-lg font-bold mb-4">
                {mode === "create" ? "Create User" : "Edit User"}
              </h2>

              <div className="space-y-3">
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-2 border rounded"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />

                <select
                  name="role"
                  disabled={currentUser?.role !== "superadmin"}
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin" className="dark:bg-gray-900 ">
                    Admin
                  </option>
                  <option value="superadmin" className="dark:bg-gray-900">
                    Super Admin
                  </option>
                </select>

                <select
                  disabled={
                    currentUser?.role !== "superadmin" &&
                    currentUser?.role !== "admin"
                  }
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Active" className="dark:bg-gray-900 ">
                    Active
                  </option>
                  <option value="suspended" className="dark:bg-gray-900 ">
                    Suspended
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose}>Cancel</button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
