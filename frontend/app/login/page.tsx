"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            alert("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: cleanEmail,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed. Please try again.");
                return;
            }

            if (!data.token || !data.user) {
                alert("Invalid response received from the server.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            alert(
                "Cannot connect to the backend. Check that the server is running on port 5000."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">

                {/* LEFT PANEL */}
                <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-700 p-10 text-white md:flex">
                    <div>
                        <Link href="/" className="text-3xl font-bold">
                            TaskFlow
                        </Link>

                        <p className="mt-2 text-blue-100">
                            Smart project management for modern teams.
                        </p>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold leading-snug">
                            Manage your work.
                            <br />
                            Achieve your goals.
                        </h1>

                        <p className="mt-4 leading-7 text-blue-100">
                            Organize projects, manage tasks, and
                            collaborate with your team in one place.
                        </p>
                    </div>

                    <p className="text-sm text-blue-200">
                        © 2026 TaskFlow
                    </p>
                </div>

                {/* RIGHT PANEL */}
                <div className="p-8 sm:p-10 md:p-12">
                    <div className="mx-auto max-w-md">

                        <Link
                            href="/"
                            className="mb-8 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            ← Back to home
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Sign in to your TaskFlow account.
                        </p>

                        <form
                            onSubmit={handleLogin}
                            className="mt-8 space-y-5"
                        >
                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            alert(
                                                "Password reset is not implemented yet."
                                            )
                                        }
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-16 text-gray-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-800"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Sign in"}
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-sm text-gray-400">OR</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    "Google login has not been implemented yet."
                                )
                            }
                            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <span className="font-bold text-red-500">G</span>
                            Continue with Google
                        </button>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}

                            <Link
                                href="/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Create an account
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </main>
    );
}