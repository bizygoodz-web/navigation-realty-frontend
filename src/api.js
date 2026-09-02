const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Wraps fetch() for authenticated agent-side API calls.
 *
 * - Attaches the stored agent token as a Bearer header automatically.
 * - On a 401 (expired or invalid token), clears the stale token and
 *   redirects to /login with a reason in the URL, instead of letting
 *   every page show its own confusing "Could not validate credentials"
 *   error. Throws afterward so the calling code's try/catch doesn't
 *   attempt to read a response body that's about to be abandoned.
 *
 * Usage: same shape as fetch(path, options), but path is relative
 * (e.g. "/contacts") and the base URL + auth header are handled here.
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("realtyflow_agent_token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("realtyflow_agent_token");
    window.location.href = "/login?reason=session_expired";
    // Redirect is async; throw so callers stop processing this response.
    throw new Error("Session expired - redirecting to login.");
  }

  return res;
}
