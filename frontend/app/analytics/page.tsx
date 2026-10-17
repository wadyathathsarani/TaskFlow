"use client";
import Link from "next/link";
import ChatBot from "../components/ChatBot";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ChatBot />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-2 text-gray-600">
          View your project and task analytics here.
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Total Projects */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Projects
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            12
          </h2>

          <p className="mt-2 text-sm text-green-600">
            +2 this month
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            98
          </h2>

          <p className="mt-2 text-sm text-green-600">
            +12 this month
          </p>
        </div>

        {/* Active Tasks */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            24
          </h2>

          <p className="mt-2 text-sm text-blue-600">
            6 due today
          </p>
        </div>

      </div>

      {/* Task Progress */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-900">
          Task Progress
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your current task completion.
        </p>

        {/* Completed */}
        <div className="mt-6">

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Completed
            </span>

            <span className="text-sm font-semibold text-gray-900">
              63%
            </span>
          </div>

          <div className="mt-2 h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: "63%" }}
            ></div>
          </div>

        </div>

        {/* In Progress */}
        <div className="mt-6">

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              In Progress
            </span>

            <span className="text-sm font-semibold text-gray-900">
              25%
            </span>
          </div>

          <div className="mt-2 h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-blue-400"
              style={{ width: "25%" }}
            ></div>
          </div>

        </div>

        {/* To Do */}
        <div className="mt-6">

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              To Do
            </span>

            <span className="text-sm font-semibold text-gray-900">
              12%
            </span>
          </div>

          <div className="mt-2 h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-gray-400"
              style={{ width: "12%" }}
            ></div>
          </div>

        </div>

      </div>

    </div>
  
  );
}