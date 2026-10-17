"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const tasks = {
  "1": {
    title: "Design analytics cards",
    description:
      "Create clean and responsive analytics cards for the TaskFlow dashboard.",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Johnson",
    project: "Design Analytics Cards",
    dueDate: "September 10, 2026",
    progress: 65,
  },
  "2": {
    title: "Review database schema",
    description:
      "Review the current database structure and identify improvements.",
    status: "To Do",
    priority: "Medium",
    assignee: "David Wilson",
    project: "Review Database Schema",
    dueDate: "September 15, 2026",
    progress: 20,
  },
  "3": {
    title: "Build login interface",
    description:
      "Develop the frontend login interface and connect the required form fields.",
    status: "Completed",
    priority: "High",
    assignee: "Thái Nhật Thơ",
    project: "TaskFlow",
    dueDate: "August 30, 2026",
    progress: 100,
  },
};

export default function TaskDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const task = tasks[id as keyof typeof tasks] || tasks["1"];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Back */}
      <Link
        href="/tasks"
        className="mb-6 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        ← Back to Tasks
      </Link>

      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Task Details
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {task.title}
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              {task.description}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              task.status === "Completed"
                ? "bg-green-100 text-green-700"
                : task.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {task.status}
          </span>

        </div>
      </div>

      {/* Information */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Priority
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {task.priority}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Assigned To
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {task.assignee}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Project
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {task.project}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Due Date
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {task.dueDate}
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Task Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current task completion
            </p>
          </div>

          <span className="text-2xl font-bold text-indigo-600">
            {task.progress}%
          </span>
        </div>

        <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${task.progress}%` }}
          />
        </div>

      </div>

      {/* Actions */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Task Actions
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">

          <button className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            Edit Task
          </button>

          <button className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change Status
          </button>

          <button className="rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
            Delete Task
          </button>

        </div>

      </div>

    </main>
  );
}