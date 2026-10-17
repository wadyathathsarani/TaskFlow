"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  bio: string;
};

const defaultProfile: ProfileData = {
  name: "",
  email: "",
  phone: "",
  jobTitle: "TaskFlow Member",
  location: "",
  bio: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const photoInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [photo, setPhoto] = useState("");
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("taskflow-profile");
      const storedPhoto = localStorage.getItem("taskflow-profile-photo");

      let user: Record<string, unknown> = {};
      let saved: Partial<ProfileData> = {};

      if (storedUser) {
        user = JSON.parse(storedUser);
      }

      if (storedProfile) {
        saved = JSON.parse(storedProfile);
      }

      setProfile({
        name:
          saved.name ||
          (typeof user.name === "string" ? user.name : "") ||
          (typeof user.username === "string" ? user.username : ""),
        email:
          saved.email ||
          (typeof user.email === "string" ? user.email : ""),
        phone: saved.phone || "",
        jobTitle: saved.jobTitle || "TaskFlow Member",
        location: saved.location || "",
        bio: saved.bio || "",
      });

      setPhoto(storedPhoto || "");
    } catch {
      setMessage("Some saved information could not be loaded.");
    }

    setLoaded(true);
  }, [router]);

  function updateField(field: keyof ProfileData, value: string) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please select a photo smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setMessage("Photo selected. Click Save Changes to keep it.");
      }
    };

    reader.onerror = () => {
      setMessage("Unable to read the photo. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function saveProfile() {
    if (!profile.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    try {
      const updated: ProfileData = {
        ...profile,
        name: profile.name.trim(),
        email: profile.email.trim(),
      };

      localStorage.setItem(
        "taskflow-profile",
        JSON.stringify(updated)
      );

      if (photo) {
        localStorage.setItem("taskflow-profile-photo", photo);
      } else {
        localStorage.removeItem("taskflow-profile-photo");
      }

      // Keep the dashboard's saved user name and email in sync.
      const storedUser = localStorage.getItem("user");
      let user: Record<string, unknown> = {};

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch {
          user = {};
        }
      }

      user.name = updated.name;
      user.username = updated.name;
      user.email = updated.email;

      localStorage.setItem("user", JSON.stringify(user));

      setProfile(updated);
      setEditing(false);
      setMessage("Your profile was saved successfully.");
    } catch {
      setMessage(
        "Unable to save. Please try a smaller photo or free browser storage."
      );
    }
  }

  function cancelEditing() {
    try {
      const saved = localStorage.getItem("taskflow-profile");
      const savedPhoto = localStorage.getItem("taskflow-profile-photo");

      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : {};

        setProfile({
          ...defaultProfile,
          name: user.name || user.username || "",
          email: user.email || "",
        });
      }

      setPhoto(savedPhoto || "");
    } catch {
      setMessage("Could not restore the saved information.");
    }

    if (photoInput.current) {
      photoInput.current.value = "";
    }

    setEditing(false);
    setMessage("");
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Loading your profile...
      </main>
    );
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-xl font-bold text-white shadow-lg">
              T
            </span>

            <span>
              <span className="block text-xl font-bold text-slate-900">
                TaskFlow
              </span>
              <span className="text-sm text-slate-500">
                Manage your work
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Sign out
            </button>
          </nav>
        </header>

        {/* Page heading */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            ← Back to dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage your personal account information.
          </p>
        </div>

        {/* Main profile card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Banner stays separate from the avatar */}
          <div className="relative h-28 bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 sm:h-36">
            <div className="absolute left-5 top-4 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              ✦ Your TaskFlow space
            </div>
          </div>

          {/* Profile picture and name: no negative margins */}
          <div className="px-5 pb-8 sm:px-8">
            <div className="flex flex-col gap-5 border-b border-slate-100 py-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-36 sm:w-36">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile picture"
                      className="block h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-sky-600">
                      {initials || "T"}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {profile.name || "Your Name"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {profile.email || "Add your email address"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-sky-700">
                    {profile.jobTitle || "TaskFlow Member"}
                  </p>

                  {profile.location && (
                    <p className="mt-1 text-sm text-slate-500">
                      📍 {profile.location}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (editing) {
                    cancelEditing();
                  } else {
                    setMessage("");
                    setEditing(true);
                  }
                }}
                className="shrink-0 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-100"
              >
                {editing ? "Cancel editing" : "✎ Edit Profile"}
              </button>
            </div>

            {message && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800"
              >
                {message}
              </div>
            )}

            {/* Photo controls */}
            {editing && (
              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Profile picture
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Select an image up to 2 MB. The whole photo is shown
                  without cropping.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    ref={photoInput}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full max-w-md text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:font-semibold file:text-sky-800 hover:file:bg-sky-200"
                  />

                  {photo && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto("");

                        if (photoInput.current) {
                          photoInput.current.value = "";
                        }

                        setMessage(
                          "Photo removed. Click Save Changes to confirm."
                        );
                      }}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Personal information */}
            <div className="pt-7">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your details up to date.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold">
                    Full name *
                  </label>
                  <input
                    id="profile-name"
                    value={profile.name}
                    readOnly={!editing}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold">
                    Email address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    readOnly={!editing}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="profile-phone" className="mb-2 block text-sm font-semibold">
                    Phone number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profile.phone}
                    readOnly={!editing}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="profile-job" className="mb-2 block text-sm font-semibold">
                    Job title
                  </label>
                  <input
                    id="profile-job"
                    value={profile.jobTitle}
                    readOnly={!editing}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="Student or Project Manager"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="profile-location" className="mb-2 block text-sm font-semibold">
                    Location
                  </label>
                  <input
                    id="profile-location"
                    value={profile.location}
                    readOnly={!editing}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="City, country"
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="profile-bio" className="mb-2 block text-sm font-semibold">
                    About me
                  </label>
                  <textarea
                    id="profile-bio"
                    rows={4}
                    value={profile.bio}
                    readOnly={!editing}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Write a short introduction about yourself..."
                    className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none ${
                      editing
                        ? "border-slate-300 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              {editing && (
                <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProfile}
                    className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          TaskFlow · Organize your work, one step at a time.
        </footer>
      </div>
    </main>
  );
}