"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const projects = {
  "1": {
    name: "Mobile Banking App",
    description:
      "A mobile banking application for managing accounts, payments and transactions.",
    status: "In Progress",
    priority: "High",
    progress: 72,
    manager: "Thái Nhật Thơ",
    deadline: "September 15, 2026",
  },
  "2": {
    name: "Design Analytics Cards",
    description:
      "Design and develop analytics cards for the TaskFlow dashboard.",
    status: "In Progress",
    priority: "Medium",
    progress: 58,
    manager: "Sarah Johnson",
    deadline: "September 20, 2026",
  },
  "3": {
    name: "Review Database Schema",
    description:
      "Review and improve the database structure for the TaskFlow system.",
    status: "Planning",
    priority: "Low",
    progress: 35,
    manager: "David Wilson",
    deadline: "October 5, 2026",
  },
};

export default function ProjectDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const project =
    projects[id as keyof typeof projects] || projects["1"];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Back button */}
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Project Details
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              {project.description}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              project.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {project.status}
          </span>

        </div>
      </div>

      {/* Project information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Priority
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {project.priority}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Project Manager
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {project.manager}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Deadline
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {project.deadline}
          </h2>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Project Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current completion status
            </p>
          </div>

          <span className="text-2xl font-bold text-indigo-600">
            {project.progress}%
          </span>
        </div>

        <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>

      </div>

      {/* Tasks */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Project Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tasks related to this project
            </p>
          </div>

          <Link
            href="/tasks"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            View All Tasks
          </Link>
        </div>

        <div className="mt-6 space-y-3">

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">
                Project planning
              </p>

              <p className="text-sm text-gray-500">
                Completed
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">
                UI development
              </p>

              <p className="text-sm text-gray-500">
                In progress
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              In Progress
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">
                Final testing
              </p>

              <p className="text-sm text-gray-500">
                Not started
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              To Do
            </span>
          </div>

        </div>

      </div>

    </main>
  );
}