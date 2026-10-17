import Image from "next/image";
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: "▦",
    title: "Project Management",
    description:
      "Organize projects, monitor progress, and keep all your project information in one place.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    number: "02",
    icon: "✓",
    title: "Smart Task Management",
    description:
      "Prioritize tasks, manage deadlines, and keep track of what needs to be done next.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
  },
  {
    number: "03",
    icon: "♧",
    title: "Team Collaboration",
    description:
      "Bring your team together, share responsibilities, and keep everyone aligned.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080d1a] text-white">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080d1a]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          {/* BRAND LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src="/taskflow-logo.png"
              alt="TaskFlow - Simple Project Management"
              width={300}
              height={100}
              priority
              className="h-auto w-44 object-contain sm:w-60"
            />
          </Link>

          {/* NAVIGATION LINKS */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Contact
            </a>
          </div>

          {/* AUTHENTICATION BUTTONS — ONE SET ONLY */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white sm:px-4"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 sm:px-5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative isolate px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute right-0 top-48 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 text-sm font-medium text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Simple project management
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Manage your projects.
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Get things done.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            TaskFlow helps you organize projects, manage tasks,
            collaborate with team members, and track your progress
            from one simple workspace.
          </p>

          {/* HERO BUTTONS */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Start for free
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.08]"
            >
              Explore features
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Plan better. Work smarter. Achieve more.
          </p>

          {/* DASHBOARD PREVIEW */}
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-blue-950/40 sm:mt-20 sm:p-5">
            <div className="rounded-xl border border-white/[0.08] bg-[#0d1425] p-5 text-left sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    Workspace overview
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    Your work, in one place
                  </h2>
                </div>

                <span className="hidden rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:inline-block">
                  Stay on track
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Projects",
                    subtitle: "Everything organized",
                    symbol: "▦",
                    color: "text-blue-400",
                  },
                  {
                    title: "Tasks",
                    subtitle: "Clear priorities",
                    symbol: "✓",
                    color: "text-cyan-400",
                  },
                  {
                    title: "Team",
                    subtitle: "Better collaboration",
                    symbol: "♧",
                    color: "text-violet-400",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5"
                  >
                    <span className={`text-2xl ${item.color}`}>
                      {item.symbol}
                    </span>

                    <h3 className="mt-4 font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Keep moving forward
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    All your work starts with a clear plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="scroll-mt-24 border-t border-white/[0.07] px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Everything in sync
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to move forward
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Spend less time managing scattered information
              and more time making meaningful progress.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl ${feature.iconColor}`}
                  >
                    {feature.icon}
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="scroll-mt-24 border-t border-white/[0.07] px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-cyan-400">
            ✦
          </div>

          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
            Meet TaskFlow
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            TaskFlow is a project management workspace designed
            to help individuals and teams plan projects, manage
            everyday tasks, collaborate effectively, and monitor
            progress from one convenient place.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Get started with TaskFlow <span>→</span>
          </Link>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-white/[0.07] px-5 py-20 sm:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/[0.06] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to get organized?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Bring your projects and tasks together.
            Start building a more organized workflow with TaskFlow.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Create your account
          </Link>

          <p className="mt-6 text-sm text-slate-400">
            Contact:{" "}
            <a
              href="mailto:support@taskflow.com"
              className="text-cyan-400 hover:text-cyan-300"
            >
              support@taskflow.com
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link href="/" className="shrink-0">
            <Image
              src="/taskflow-logo.png"
              alt="TaskFlow"
              width={300}
              height={100}
              className="h-auto w-44 object-contain"
            />
          </Link>

          <p className="text-center text-sm text-slate-500">
            © 2026 TaskFlow. Organize your work. Achieve your goals.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">
            <Link
              href="/login"
              className="transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="transition hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}