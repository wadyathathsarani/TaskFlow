"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Task = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
};

type Project = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

function getList<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record[key])) return record[key] as T[];
    if (Array.isArray(record.data)) return record.data as T[];
  }

  return [];
}

function normalizeStatus(status?: string): string {
  const value = (status || "").toLowerCase().replace(/[_-]/g, " ").trim();

  if (
    value.includes("complete") ||
    value === "done" ||
    value === "finished"
  ) {
    return "completed";
  }

  if (value.includes("progress") || value === "doing") {
    return "in progress";
  }

  if (
    value.includes("pending") ||
    value.includes("todo") ||
    value.includes("to do") ||
    value === "new" ||
    value === "planning"
  ) {
    return "pending";
  }

  return value || "pending";
}

function formatDate(date?: string): string {
  if (!date) return "No due date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "No due date";

  return parsedDate.toLocaleDateString();
}

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState("there");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskError, setTaskError] = useState("");
  const [projectError, setProjectError] = useState("");

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUsername(user.name || user.username || "there");
        setEmail(user.email || "");
      } catch {
        setUsername("there");
        setEmail("");
      }
    }

    setLoading(true);
    setTaskError("");
    setProjectError("");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const taskRequest = fetch("http://localhost:5000/api/tasks", {
      method: "GET",
      headers,
      cache: "no-store",
    })
      .then(async (response) => {
        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            data &&
            typeof data === "object" &&
            "message" in data
              ? String(data.message)
              : "Unable to load tasks.";

          throw new Error(message);
        }

        setTasks(getList<Task>(data, "tasks"));
      })
      .catch((error: unknown) => {
        console.error("Dashboard tasks error:", error);
        setTaskError(
          error instanceof Error ? error.message : "Unable to load tasks."
        );
      });

    const projectRequest = fetch("http://localhost:5000/api/projects", {
      method: "GET",
      headers,
      cache: "no-store",
    })
      .then(async (response) => {
        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            data &&
            typeof data === "object" &&
            "message" in data
              ? String(data.message)
              : "Unable to load projects.";

          throw new Error(message);
        }

        setProjects(getList<Project>(data, "projects"));
      })
      .catch((error: unknown) => {
        console.error("Dashboard projects error:", error);
        setProjectError(
          error instanceof Error
            ? error.message
            : "Unable to load projects."
        );
      });

    try {
      await Promise.all([taskRequest, projectRequest]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();

    const handleFocus = () => void loadDashboard();
    const handlePageShow = () => void loadDashboard();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [loadDashboard]);

  const projectCounts = useMemo(() => {
    const completed = projects.filter(
      (project) => normalizeStatus(project.status) === "completed"
    ).length;

    const inProgress = projects.filter(
      (project) => normalizeStatus(project.status) === "in progress"
    ).length;

    const pending = projects.filter(
      (project) => normalizeStatus(project.status) === "pending"
    ).length;

    return {
      total: projects.length,
      completed,
      inProgress,
      pending,
    };
  }, [projects]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tasks]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [projects]);

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  const overviewCards = [
    {
      title: "Total projects",
      value: projectCounts.total,
      description: "All projects in your account",
      icon: "▦",
      color: "blue",
    },
    {
      title: "In progress projects",
      value: projectCounts.inProgress,
      description: "Projects currently being worked on",
      icon: "◷",
      color: "violet",
    },
    {
      title: "Completed projects",
      value: projectCounts.completed,
      description: "Successfully completed projects",
      icon: "✓",
      color: "green",
    },
    {
      title: "Pending projects",
      value: projectCounts.pending,
      description: "Projects waiting to start",
      icon: "◷",
      color: "orange",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">
              T
            </span>
            <span>
              <span className="block text-lg font-bold">TaskFlow</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Manage your work
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              Dashboard
            </Link>
            <Link href="/tasks" className="hover:text-blue-600">
              Tasks
            </Link>
            <Link href="/projects" className="hover:text-blue-600">
              Projects
            </Link>
            <Link href="/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <Link href="/settings" className="hover:text-blue-600">
              Settings
            </Link>
            <button
              onClick={signOut}
              className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 p-7 text-white shadow-lg sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
              Your TaskFlow workspace
            </p>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Good to see you, {username}!
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Stay organized, keep your tasks moving, and turn your plans
              into achievements.
            </p>

            {email && (
              <p className="mt-2 text-sm text-white/80">{email}</p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow transition hover:bg-blue-50"
              >
                View projects →
              </Link>
              <Link
                href="/tasks"
                className="rounded-xl border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Explore tasks →
              </Link>
              <button
                onClick={() => void loadDashboard()}
                disabled={loading}
                className="rounded-xl border border-white/50 px-5 py-3 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-60"
              >
                {loading ? "Refreshing…" : "↻ Refresh"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Your overview</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                A live summary of your projects
              </p>
            </div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <Link
                key={card.title}
                href="/projects"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {card.title}
                  </span>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${
                      card.color === "blue"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : card.color === "violet"
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                          : card.color === "green"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    }`}
                  >
                    {card.icon}
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold tracking-tight">
                  {loading ? "…" : card.value}
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {card.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                  Open details →
                </p>
              </Link>
            ))}
          </div>

          {taskError && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              Tasks could not be loaded: {taskError}
            </div>
          )}

          {projectError && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              Projects could not be loaded: {projectError}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Recent tasks</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your latest task activity
                </p>
              </div>
              <Link
                href="/tasks"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Loading your tasks…
              </p>
            ) : taskError ? (
              <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Task information is currently unavailable.
              </p>
            ) : recentTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
                <div className="text-3xl">✓</div>
                <h3 className="mt-3 font-semibold">No tasks yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your tasks will appear here when you create them.
                </p>
                <Link
                  href="/tasks"
                  className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Explore tasks
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task, index) => {
                  const status = normalizeStatus(task.status);
                  const taskId = task._id || task.id || String(index);

                  const statusLabel =
                    status === "completed"
                      ? "Completed"
                      : status === "in progress"
                        ? "In Progress"
                        : "Pending";

                  const statusStyle =
                    status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : status === "in progress"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";

                  const priority = (task.priority || "medium").toLowerCase();

                  const priorityStyle =
                    priority === "high"
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : priority === "low"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";

                  return (
                    <Link
                      href="/tasks"
                      key={taskId}
                      className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-slate-800/60"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-semibold">
                            {task.title || task.name || "Untitled task"}
                          </p>
                          <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">
                            {task.description || "No description provided"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyle}`}
                        >
                          {priority} priority
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Your projects</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your workspace at a glance
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5 dark:bg-blue-950/40">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total projects
              </p>
              <p className="mt-2 text-4xl font-bold text-blue-700 dark:text-blue-300">
                {loading ? "…" : projects.length}
              </p>
            </div>

            {projectError ? (
              <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">
                Projects could not be loaded: {projectError}
              </p>
            ) : recentProjects.length > 0 && !loading ? (
              <div className="mt-4 space-y-3">
                {recentProjects.map((project, index) => (
                  <div
                    key={project._id || project.id || index}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <p className="truncate font-semibold">
                      {project.name || project.title || "Untitled project"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {project.status || "Project"}
                    </p>
                  </div>
                ))}
              </div>
            ) : !loading && !projectError ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Your projects will appear here when available.
              </p>
            ) : null}

            <Link
              href="/projects"
              className="mt-5 flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Manage projects →
            </Link>
          </div>
        </section>

        <footer className="pb-4 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} TaskFlow. Stay organized, achieve more.
        </footer>
      </div>
    </main>
  );
}