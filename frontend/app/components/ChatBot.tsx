"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "model";
  text: string;
};

const API_URL = "http://localhost:5000/api/chat";

const suggestions = [
  "How do I create a task?",
  "How do I manage projects?",
  "Explain task priorities",
  "How can I track my progress?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hi! 👋 I'm your TaskFlow AI Assistant.\n\nI can help you manage tasks and projects, understand priorities, track progress, and learn how to use TaskFlow.\n\nWhat would you like help with today?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim();

    if (!question || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in to use the TaskFlow AI Assistant.");
      return;
    }

    const previousMessages = messages.filter(
      (message) =>
        message.text !==
        "Hi! 👋 I'm your TaskFlow AI Assistant.\n\nI can help you manage tasks and projects, understand priorities, track progress, and learn how to use TaskFlow.\n\nWhat would you like help with today?"
    );

    setMessages((current) => [
      ...current,
      { role: "user", text: question },
    ]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: question,
          history: previousMessages.slice(-10),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to contact the AI assistant."
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The AI assistant returned an empty response.");
      }

      setMessages((current) => [
        ...current,
        { role: "model", text: data.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleClose() {
    setOpen(false);
    setError("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1000] font-sans">
      {open && (
        <section
          className="mb-4 flex h-[min(600px,75vh)] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          aria-label="TaskFlow AI Assistant"
          aria-live="polite"
        >
          {/* Header */}
          <header className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl">
                ✨
              </div>
              <div>
                <h2 className="font-semibold">TaskFlow AI</h2>
                <p className="text-xs text-indigo-100">
                  Your work management assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close chatbot"
              className="rounded-lg px-3 py-2 text-xl hover:bg-white/15"
            >
              ×
            </button>
          </header>

          {/* Conversation */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  Try asking:
                </p>

                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendMessage(suggestion)}
                    className="block w-full rounded-xl border border-indigo-100 bg-white px-3 py-2 text-left text-sm text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {suggestion} →
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  <span className="animate-pulse">
                    TaskFlow AI is thinking...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
                {error.includes("sign in") && (
                  <a
                    href="/login"
                    className="ml-1 font-semibold underline"
                  >
                    Login
                  </a>
                )}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about tasks or projects..."
                aria-label="Type your message"
                maxLength={2000}
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              TaskFlow AI can make mistakes. Verify important information.
            </p>
          </form>
        </section>
      )}

      {/* Floating assistant button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close TaskFlow AI" : "Open TaskFlow AI"}
          className="flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <span className="text-xl">{open ? "×" : "✦"}</span>
          <span className="font-semibold">
            {open ? "Close" : "Ask TaskFlow AI"}
          </span>
        </button>
      </div>
    </div>
  );
}