"use client";

import { useState } from "react";

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Away";
  initials: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "Thái Nhật Thơ",
      email: "thai@example.com",
      role: "Project Manager",
      department: "Management",
      status: "Active",
      initials: "TN",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "UI/UX Designer",
      department: "Design",
      status: "Active",
      initials: "SJ",
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david@example.com",
      role: "Frontend Developer",
      department: "Development",
      status: "Active",
      initials: "DW",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@example.com",
      role: "Backend Developer",
      department: "Development",
      status: "Away",
      initials: "EB",
    },
    {
      id: 5,
      name: "Michael Lee",
      email: "michael@example.com",
      role: "QA Engineer",
      department: "Quality Assurance",
      status: "Active",
      initials: "ML",
    },
    {
      id: 6,
      name: "Jessica Taylor",
      email: "jessica@example.com",
      role: "Business Analyst",
      department: "Analysis",
      status: "Active",
      initials: "JT",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const awayMembers = members.filter(
    (member) => member.status === "Away"
  ).length;

  const createMember = () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      return;
    }

    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newMember: Member = {
      id: members.length + 1,
      name,
      email,
      role,
      department: department || "General",
      status: "Active",
      initials,
    };

    setMembers((previous) => [...previous, newMember]);

    setName("");
    setEmail("");
    setRole("");
    setDepartment("");
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Team
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your team members and their roles.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          + Add Member
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Members
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {members.length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Active Members
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeMembers}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Away
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {awayMembers}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search team members..."
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* TEAM GRID */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* MEMBER HEADER */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                    {member.initials}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {member.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {member.role}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Department
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {member.department}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              <button
                className="mt-6 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">
          <p className="text-gray-500">
            No team members found.
          </p>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Add Team Member
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>

                <input
                  type="text"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <input
                  type="text"
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  placeholder="e.g. Development"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* MODAL BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={createMember}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}