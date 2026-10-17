"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/tasks";

type TaskStatus = "pending" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt?: string;
};

const statusLabels: Record<TaskStatus, string> = {
  pending: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};

const priorityColors: Record<Priority, string> = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  low: "text-emerald-400 bg-emerald-400/10",
};

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

function getErrorMessage(data: any, fallback: string) {
  return data?.message || data?.error || fallback;
}

function getList<T>(data: any, key: string): T[] | null {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  return null;
}

function normalizeStatus(status?: string): TaskStatus {
  const value = (status || "").toLowerCase().replace(/[_\s]/g, "-");

  if (["completed", "complete", "done", "finished"].includes(value)) {
    return "completed";
  }

  if (["in-progress", "progress", "doing"].includes(value)) {
    return "in-progress";
  }

  return "pending";
}

function normalizePriority(priority?: string): Priority {
  if (priority === "low" || priority === "high") return priority;
  return "medium";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please sign in to view your tasks.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        setError("Your session may have expired. Please sign in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Unable to load tasks."));
      }

      const list = getList<Task>(data, "tasks");

      if (!list) {
        throw new Error(
          "The task API returned an unexpected format. Check taskController.js."
        );
      }

      setTasks(
        list.map((task) => ({
          ...task,
          status: normalizeStatus(task.status),
          priority: normalizePriority(task.priority),
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the TaskFlow backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();

    const refresh = () => void loadTasks();

    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (filter === "all" || task.status === filter)
      );
    });
  }, [tasks, search, filter]);

  const counts = useMemo(
    () => ({
      total: tasks.length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      pending: tasks.filter((task) => task.status === "pending").length,
    }),
    [tasks]
  );

  async function updateTask(id: string, changes: Partial<Task>) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const token = getToken();

      if (!token) throw new Error("Please sign in again.");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Could not update this task."));
      }

      await loadTasks();
      setEditingTask(null);
      setSelectedTask(null);
      setNotice("Task updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update this task."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(id: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Could not delete this task."));
      }

      setSelectedTask(null);
      setEditingTask(null);
      setNotice("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete this task."
      );
    }
  }

  function formatDate(value?: string) {
    if (!value) return "No due date";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No due date";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function dateInputValue(value?: string) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const overviewCards = [
    {
      label: "Total tasks",
      value: counts.total,
      description: "All tasks in your workspace",
      icon: "▦",
      iconStyle: "bg-blue-500/20 text-blue-300",
    },
    {
      label: "In progress",
      value: counts.inProgress,
      description: "Tasks currently being worked on",
      icon: "◷",
      iconStyle: "bg-violet-500/20 text-violet-300",
    },
    {
      label: "Completed",
      value: counts.completed,
      description: "Successfully completed tasks",
      icon: "✓",
      iconStyle: "bg-emerald-500/15 text-emerald-300",
    },
    {
      label: "Pending tasks",
      value: counts.pending,
      description: "Tasks waiting to start",
      icon: "◌",
      iconStyle: "bg-orange-500/15 text-orange-300",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              TaskFlow workspace
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">My Tasks</h1>
            <p className="mt-2 text-slate-400">
              Manage your actual saved tasks and track their progress.
            </p>
          </div>

          <button
            onClick={() => void loadTasks()}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh tasks"}
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {notice}
          </div>
        )}

        {/* Dashboard-inspired overview cards */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Your overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              A live summary of your tasks
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-300">
                    {item.label}
                  </p>
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-inner ${item.iconStyle}`}
                  >
                    {item.icon}
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold tracking-tight text-white">
                  {item.value}
                </p>

                <p className="mt-3 min-h-10 text-sm leading-5 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks by title or description..."
            aria-label="Search tasks"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter tasks by status"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          >
            <option value="all">All statuses</option>
            <option value="pending">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">All tasks</h2>
          <span className="text-sm text-slate-400">
            {filteredTasks.length} displayed
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
            Loading your saved tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 px-6 py-16 text-center">
            <div className="mb-4 text-4xl text-cyan-400">✓</div>
            <h2 className="text-xl font-semibold">
              {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              {tasks.length === 0
                ? "Your saved tasks will appear here when you create them. No sample tasks are being added."
                : "Try another search term or choose a different status."}
            </p>
            {tasks.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <article
                key={task._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="break-words text-lg font-bold">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityColors[task.priority] || priorityColors.medium
                        }`}
                      >
                        {task.priority || "medium"} priority
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">
                      {task.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        {statusLabels[task.status] || task.status}
                      </span>
                      <span className="text-slate-400">
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={`status-${task._id}`}
                        className="text-sm text-slate-400"
                      >
                        Update status:
                      </label>
                      <select
                        id={`status-${task._id}`}
                        value={task.status}
                        onChange={(event) =>
                          void updateTask(task._id, {
                            status: event.target.value as TaskStatus,
                          })
                        }
                        disabled={saving}
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-50"
                      >
                        <option value="pending">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      View details
                    </button>
                    <button
                      onClick={() => setEditingTask({ ...task })}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void deleteTask(task._id)}
                      className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          Task counts are calculated from the tasks returned by your backend.
        </p>
      </div>

      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedTask(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-details-title"
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="task-details-title" className="text-xl font-bold">
                Task details
              </h2>
              <button
                onClick={() => setSelectedTask(null)}
                aria-label="Close details"
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              {selectedTask.title}
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
              {selectedTask.description || "No description provided."}
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="text-slate-400">Status: </span>
                {statusLabels[selectedTask.status] || selectedTask.status}
              </p>
              <p>
                <span className="text-slate-400">Priority: </span>
                {selectedTask.priority}
              </p>
              <p>
                <span className="text-slate-400">Due date: </span>
                {formatDate(selectedTask.dueDate)}
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTask({ ...selectedTask });
                setSelectedTask(null);
              }}
              className="mt-7 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Edit task
            </button>
          </section>
        </div>
      )}

      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingTask(null);
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void updateTask(editingTask._id, {
                title: editingTask.title.trim(),
                description: editingTask.description || "",
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate
                  ? new Date(editingTask.dueDate).toISOString()
                  : undefined,
              });
            }}
            className="my-8 w-full max-w-lg space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Edit task</h2>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                aria-label="Close edit form"
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div>
              <label htmlFor="edit-title" className="mb-2 block text-sm">
                Task title *
              </label>
              <input
                id="edit-title"
                required
                value={editingTask.title}
                onChange={(event) =>
                  setEditingTask({ ...editingTask, title: event.target.value })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="mb-2 block text-sm">
                Description
              </label>
              <textarea
                id="edit-description"
                rows={4}
                value={editingTask.description || ""}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    description: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-status" className="mb-2 block text-sm">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={editingTask.status}
                  onChange={(event) =>
                    setEditingTask({
                      ...editingTask,
                      status: event.target.value as TaskStatus,
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  <option value="pending">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-priority" className="mb-2 block text-sm">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={editingTask.priority}
                  onChange={(event) =>
                    setEditingTask({
                      ...editingTask,
                      priority: event.target.value as Priority,
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-due-date" className="mb-2 block text-sm">
                Due date
              </label>
              <input
                id="edit-due-date"
                type="date"
                value={dateInputValue(editingTask.dueDate)}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    dueDate: event.target.value
                      ? `${event.target.value}T12:00:00`
                      : undefined,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-lg border border-slate-600 px-4 py-2.5 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !editingTask.title.trim()}
                className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}