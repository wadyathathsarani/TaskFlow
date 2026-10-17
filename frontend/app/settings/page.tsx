"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Theme = "light" | "dark" | "system";

type Preferences = {
  notifications: boolean;
  emailUpdates: boolean;
  taskReminders: boolean;
  soundEffects: boolean;
};

const defaultPreferences: Preferences = {
  notifications: true,
  emailUpdates: false,
  taskReminders: true,
  soundEffects: false,
};

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedTheme = localStorage.getItem("taskflow-theme");
      const storedPreferences =
        localStorage.getItem("taskflow-settings");

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setName(user.name || user.username || "");
        setEmail(user.email || "");
      }

      if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
      ) {
        setTheme(storedTheme);
      }

      if (storedPreferences) {
        const parsed = JSON.parse(storedPreferences);

        setPreferences({
          notifications:
            parsed.notifications ?? defaultPreferences.notifications,
          emailUpdates:
            parsed.emailUpdates ?? defaultPreferences.emailUpdates,
          taskReminders:
            parsed.taskReminders ?? defaultPreferences.taskReminders,
          soundEffects:
            parsed.soundEffects ?? defaultPreferences.soundEffects,
        });
      }
    } catch {
      console.error("Unable to load TaskFlow settings.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      const dark =
        theme === "dark" ||
        (theme === "system" && media.matches);

      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = dark
        ? "dark"
        : "light";
      document.documentElement.style.colorScheme = dark
        ? "dark"
        : "light";
    };

    applyTheme();

    if (theme === "system") {
      media.addEventListener("change", applyTheme);
    }

    return () => {
      media.removeEventListener("change", applyTheme);
    };
  }, [theme, loaded]);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem("taskflow-theme", nextTheme);
    setSaved(false);
  }

  function changePreference(
    key: keyof Preferences,
    value: boolean
  ) {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem(
      "taskflow-settings",
      JSON.stringify(preferences)
    );

    setSaved(true);
  }

  function resetSettings() {
    setPreferences(defaultPreferences);
    localStorage.setItem(
      "taskflow-settings",
      JSON.stringify(defaultPreferences)
    );
    changeTheme("light");
    setSaved(true);
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-white">
        Loading your settings...
      </main>
    );
  }

  const themeOptions: {
    value: Theme;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Light mode",
      icon: "☀️",
      description: "A bright, clear workspace",
    },
    {
      value: "dark",
      label: "Dark mode",
      icon: "🌙",
      description: "Comfortable in low light",
    },
    {
      value: "system",
      label: "System",
      icon: "💻",
      description: "Follow your device settings",
    },
  ];

  const toggles: {
    key: keyof Preferences;
    label: string;
    description: string;
  }[] = [
    {
      key: "notifications",
      label: "Notifications",
      description: "Enable notification preferences",
    },
    {
      key: "taskReminders",
      label: "Task reminders",
      description: "Keep reminders enabled as a preference",
    },
    {
      key: "emailUpdates",
      label: "Email updates",
      description: "Choose to receive email updates",
    },
    {
      key: "soundEffects",
      label: "Sound effects",
      description: "Enable interface sound preferences",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black text-white shadow-lg">
              T
            </span>
            <span>
              <span className="block text-xl font-bold">TaskFlow</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Workspace settings
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:py-12">
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Personalize your workspace
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Settings ⚙️
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Make TaskFlow work the way you prefer.
          </p>
        </section>

        {saved && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          >
            ✓ Your preferences have been saved.
          </div>
        )}

        {/* Appearance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl dark:bg-indigo-950">
              🎨
            </span>
            <div>
              <h2 className="text-xl font-bold">Appearance</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred theme.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={theme === option.value}
                onClick={() => changeTheme(option.value)}
                className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === option.value
                    ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:bg-indigo-950"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="mt-2 block font-bold">
                  {option.label}
                  {theme === option.value ? " ✓" : ""}
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Account */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-950">
              👤
            </span>
            <div>
              <h2 className="text-xl font-bold">Account information</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your current TaskFlow account details.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full name
              </label>
              <input
                value={name}
                readOnly
                placeholder="No name saved"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email address
              </label>
              <input
                value={email}
                readOnly
                placeholder="No email saved"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <Link
            href="/profile"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Edit profile →
          </Link>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl dark:bg-amber-950">
              🔔
            </span>
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your notification preferences.
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {toggles.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences[item.key]}
                  aria-label={item.label}
                  onClick={() =>
                    changePreference(
                      item.key,
                      !preferences[item.key]
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    preferences[item.key]
                      ? "bg-indigo-600"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      preferences[item.key]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            These switches save preferences only. Actual email delivery
            and scheduled reminders require additional backend features.
          </p>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl dark:bg-emerald-950">
              🔐
            </span>
            <div>
              <h2 className="text-xl font-bold">Privacy & security</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sign out of your account on this device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out?")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }
            }}
            className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
          >
            Sign out
          </button>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetSettings}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Reset preferences
          </button>
          <button
            type="button"
            onClick={saveSettings}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
          >
            Save preferences
          </button>
        </div>

        <footer className="py-4 text-center text-xs text-slate-400">
          TaskFlow · Your workspace, your way.
        </footer>
      </div>
    </main>
  );
}