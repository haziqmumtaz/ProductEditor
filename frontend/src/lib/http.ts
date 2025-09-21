const BASE =
  import.meta.env.VITE_API_BASE ?? "http://example.com/URL_IS_MISSING";
const DEFAULT_TIMEOUT = 5_000;

function toQuery(params?: Record<string, unknown>) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function request<T>(
  path: string,
  opts: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(),
    opts.timeout ?? DEFAULT_TIMEOUT
  );

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers || {}),
      },
      signal: controller.signal,
      ...opts,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
      const msg =
        (data && (data.error || data.message)) ||
        `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }
    return data as T;
  } finally {
    clearTimeout(id);
  }
}

export const apiHttpClient = {
  get: <T>(
    path: string,
    params?: Record<string, unknown>,
    init?: RequestInit
  ) =>
    request<T>(`${path}${toQuery(params)}`, { method: "GET", ...(init || {}) }),
  post: <T, B = unknown>(path: string, body?: B, init?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...(init || {}),
    }),
  put: <T, B = unknown>(path: string, body?: B, init?: RequestInit) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...(init || {}),
    }),
  patch: <T, B = unknown>(path: string, body?: B, init?: RequestInit) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...(init || {}),
    }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...(init || {}) }),
};
