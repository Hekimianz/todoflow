"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Todo, Priority } from "@/lib/api";

type Filter = "all" | "active" | "completed";
type EditForm = { title: string; description: string; priority: Priority };

const priorityConfig: Record<Priority, { label: string; dot: string; badge: string }> = {
  high:   { label: "High",   dot: "bg-red-400",     badge: "bg-red-500/15 text-red-400 border border-red-500/20" },
  medium: { label: "Medium", dot: "bg-amber-400",   badge: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  low:    { label: "Low",    dot: "bg-emerald-400", badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
};

const defaultForm = { title: "", description: "", priority: "medium" as Priority };

export default function Dashboard() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    api.todos.getAll()
      .then(setTodos)
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const todo = await api.todos.create(form);
      setTodos((prev) => [todo, ...prev]);
      setForm(defaultForm);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
    );
    try {
      await api.todos.update(todo.id, { completed: !todo.completed });
    } catch {
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: todo.completed } : t)),
      );
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditForm({ title: todo.title, description: todo.description, priority: todo.priority });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editForm.title.trim()) return;
    setSaving(true);
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...editForm } : t)),
      );
      await api.todos.update(editingId, editForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await api.todos.delete(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Orbs */}
      <div className="orb-1 absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700 opacity-20 blur-[120px] pointer-events-none" />
      <div className="orb-2 absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-800 opacity-15 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">TodoFlow</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Sign out
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">My Tasks</h1>
            <p className="text-muted text-sm mt-1">
              {activeCount === 0 ? "All done!" : `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Task
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="relative rounded-2xl p-px bg-gradient-to-b from-violet-500/30 to-transparent mb-6">
            <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-6">
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Task title"
                  required
                  autoFocus
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <div className="flex items-center gap-2">
                  {(["low", "medium", "high"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, priority: p }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        form.priority === p
                          ? priorityConfig[p].badge
                          : "bg-white/5 border-white/10 text-muted hover:text-foreground"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${form.priority === p ? priorityConfig[p].dot : "bg-muted"}`} />
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setForm(defaultForm); }}
                    className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {submitting ? "Creating…" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
          {([
            { key: "all",       label: `All ${todos.length}` },
            { key: "active",    label: `Active ${activeCount}` },
            { key: "completed", label: `Done ${completedCount}` },
          ] as { key: Filter; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filter === key
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Todo list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-foreground font-semibold mb-1">
              {filter === "completed" ? "No completed tasks yet" : filter === "active" ? "No active tasks" : "No tasks yet"}
            </h3>
            <p className="text-muted text-sm">
              {filter === "all" ? "Hit \"New Task\" to create your first one." : "Switch to All to see everything."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((todo) => (
              <div
                key={todo.id}
                className={`relative rounded-2xl p-px transition-all ${
                  editingId === todo.id
                    ? "bg-gradient-to-b from-violet-500/40 to-transparent"
                    : todo.completed
                    ? "bg-gradient-to-b from-white/5 to-transparent opacity-60"
                    : "bg-gradient-to-b from-violet-500/20 to-transparent"
                }`}
              >
                {editingId === todo.id ? (
                  /* Edit form */
                  <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-5">
                    <form onSubmit={handleEdit} className="flex flex-col gap-3">
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Task title"
                        required
                        autoFocus
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      />
                      <input
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Description (optional)"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      />
                      <div className="flex items-center gap-2">
                        {(["low", "medium", "high"] as Priority[]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEditForm((f) => ({ ...f, priority: p }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              editForm.priority === p
                                ? priorityConfig[p].badge
                                : "bg-white/5 border-white/10 text-muted hover:text-foreground"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${editForm.priority === p ? priorityConfig[p].dot : "bg-muted"}`} />
                            {priorityConfig[p].label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Read view */
                  <div className="bg-surface/60 backdrop-blur-xl rounded-2xl px-5 py-4 flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(todo)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        todo.completed
                          ? "bg-success border-success"
                          : "border-white/20 hover:border-violet-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm leading-snug ${todo.completed ? "line-through text-muted" : "text-foreground"}`}>
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className="text-muted text-xs mt-1 leading-relaxed">{todo.description}</p>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${priorityConfig[todo.priority].badge}`}>
                        {priorityConfig[todo.priority].label}
                      </span>
                      <button
                        onClick={() => startEdit(todo)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 flex items-center justify-center text-muted hover:text-violet-400 transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-danger/15 border border-white/10 hover:border-danger/30 flex items-center justify-center text-muted hover:text-danger transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
