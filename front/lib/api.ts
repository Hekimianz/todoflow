const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    register: (username: string, password: string) =>
      request<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
  },
  todos: {
    getAll: () => request<Todo[]>("/todos"),
    create: (data: { title: string; description: string; priority?: Priority }) =>
      request<Todo>("/todos", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Pick<Todo, "title" | "description" | "priority" | "completed">>) =>
      request<Todo>(`/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/todos/${id}`, { method: "DELETE" }),
  },
};
