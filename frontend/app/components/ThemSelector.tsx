"use client";

import { useTheme, type Theme } from "../ThemeProvider";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const options: {
    value: Theme;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: "☀️",
      description: "Bright and clear",
    },
    {
      value: "dark",
      label: "Dark",
      icon: "🌙",
      description: "Comfortable in low light",
    },
    {
      value: "system",
      label: "System",
      icon: "💻",
      description: "Follow your device",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <h2 className="text-lg font-bold">Appearance</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose how TaskFlow looks on your device.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={selected}
              className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selected
                  ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:bg-indigo-950"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-2xl">{option.icon}</span>

              <span className="mt-2 block font-semibold">
                {option.label}
                {selected && (
                  <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-300">
                    ✓ Selected
                  </span>
                )}
              </span>

              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}