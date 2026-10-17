"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const PROJECTS_API = "http://localhost:5000/api/projects";
const TASKS_API = "http://localhost:5000/api/tasks";

type ProjectStatus = "planning" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

type Project = {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
};

type Task = {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  project?: string | { _id: string };
  projectId?: string | { _id: string };
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  "in-progress": "In Progress",
  completed: "Completed",
};

const priorityClasses: Record<Priority, string> = {
  low: "bg-emerald-500/15 text-emerald-300",
  medium: "bg-amber-500/15 text-amber-300",
  high: "bg-red-500/15 text-red-300",
};

function readToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

function getMessage(data: any, fallback: string) {
  return data?.message || data?.error || fallback;
}

function formatDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function linkedProjectId(value: Task["project"] | Task["projectId"]) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [priority, setPriority] = useState<Priority>("medium");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = readToken();

    if (!token) {
      setError("Please sign in to view your projects.");
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const projectResponse = await fetch(PROJECTS_API, {
        headers,
        cache: "no-store",
      });

      const projectData = await projectResponse.json().catch(() => ({}));

      if (!projectResponse.ok) {
        throw new Error(
          getMessage(projectData, "Unable to load your projects.")
        );
      }

      if (!Array.isArray(projectData.projects)) {
        throw new Error("The projects API did not return a projects array.");
      }

      setProjects(projectData.projects);

      // Task counts are available only if tasks are linked to project IDs.
      const taskResponse = await fetch(TASKS_API, {
        headers,
        cache: "no-store",
      });

      if (taskResponse.ok) {
        const taskData = await taskResponse.json().catch(() => ({}));
        const taskList = Array.isArray(taskData)
          ? taskData
          : taskData.tasks;

        setTasks(Array.isArray(taskList) ? taskList : []);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const summaries = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(
      (project) => project.status === "in-progress"
    ).length;
    const completed = projects.filter(
      (project) => project.status === "completed"
    ).length;
    const planning = projects.filter(
      (project) => project.status === "planning"
    ).length;

    return { total, inProgress, completed, planning };
  }, [projects]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        (project.description || "").toLowerCase().includes(query);

      const matchesStatus = filter === "all" || project.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filter]);

  function projectStats(project: Project) {
    const linkedTasks = tasks.filter((task) => {
      const taskProjectId =
        linkedProjectId(task.project) || linkedProjectId(task.projectId);

      return taskProjectId === project._id;
    });

    const completedTasks = linkedTasks.filter(
      (task) => task.status === "completed"
    ).length;

    const progress =
      linkedTasks.length > 0
        ? Math.round((completedTasks / linkedTasks.length) * 100)
        : project.status === "completed"
        ? 100
        : 0;

    return {
      total: linkedTasks.length,
      completed: completedTasks,
      progress,
    };
  }

  function resetForm() {
    setName("");
    setDescription("");
    setStatus("planning");
    setPriority("medium");
    setStartDate("");
    setDueDate("");
    setEditingProject(null);
    setShowForm(false);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setStatus(project.status);
    setPriority(project.priority || "medium");
    setStartDate(
      project.startDate ? project.startDate.slice(0, 10) : ""
    );
    setDueDate(project.dueDate ? project.dueDate.slice(0, 10) : "");
    setShowForm(true);
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const token = readToken();

      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
        priority,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
      };

      const isEditing = Boolean(editingProject);

      const response = await fetch(
        isEditing
          ? `${PROJECTS_API}/${editingProject!._id}`
          : PROJECTS_API,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getMessage(data, "Unable to save the project.")
        );
      }

      resetForm();
      setNotice(
        isEditing
          ? "Project updated successfully."
          : "Project created successfully."
      );

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${PROJECTS_API}/${project._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${readToken()}` },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getMessage(data, "Unable to delete the project.")
        );
      }

      setNotice("Project deleted successfully.");
      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete the project."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              TaskFlow workspace
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Projects</h1>
            <p className="mt-2 text-slate-400">
              Manage your saved projects and track their progress.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            + New Project
          </button>
        </header>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {notice}
          </div>
        )}

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Projects", value: summaries.total },
            { label: "In Progress", value: summaries.inProgress },
            { label: "Completed", value: summaries.completed },
            { label: "Planning", value: summaries.planning },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter projects by status"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
          >
            <option value="all">All statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => void loadProjects()}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
            Loading your saved projects...
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-6 py-16 text-center">
            <p className="text-xl font-semibold">
              {projects.length === 0 ? "No projects yet" : "No matching projects"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {projects.length === 0
                ? "Create your first project to see it here. No sample projects are added."
                : "Try changing your search or status filter."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={openCreateForm}
                className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {visibleProjects.map((project) => {
              const stats = projectStats(project);

              return (
                <article
                  key={project._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="break-words text-xl font-bold">
                        {project.name}
                      </h2>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        project.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : project.status === "in-progress"
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[project.priority] || priorityClasses.medium}`}>
                      {project.priority || "medium"} priority
                    </span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      Due: {formatDate(project.dueDate)}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">Task completion</span>
                      <span className="font-semibold">{stats.progress}%</span>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-slate-800"
                      role="progressbar"
                      aria-valuenow={stats.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${project.name} task completion`}
                    >
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                    <div>
                      <p className="text-xs text-slate-400">Linked tasks</p>
                      <p className="mt-1 text-xl font-bold">{stats.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Completed tasks</p>
                      <p className="mt-1 text-xl font-bold">{stats.completed}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/projects/${project._id}`}
                      className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      View Project →
                    </Link>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditForm(project)}
                        className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void deleteProject(project)}
                        className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) resetForm();
          }}
        >
          <form
            onSubmit={saveProject}
            className="my-8 w-full max-w-xl space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                aria-label="Close project form"
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div>
              <label htmlFor="project-name" className="mb-2 block text-sm font-medium">
                Project name *
              </label>
              <input
                id="project-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter project name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label htmlFor="project-description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="project-description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your project"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="project-status" className="mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ProjectStatus)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="project-priority" className="mb-2 block text-sm font-medium">
                  Priority
                </label>
                <select
                  id="project-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Priority)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="project-start-date" className="mb-2 block text-sm font-medium">
                  Start date
                </label>
                <input
                  id="project-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                />
              </div>

              <div>
                <label htmlFor="project-due-date" className="mb-2 block text-sm font-medium">
                  Due date
                </label>
                <input
                  id="project-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-slate-600 px-4 py-2.5 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingProject
                  ? "Save Changes"
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}