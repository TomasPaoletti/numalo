export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const SESSION_KEY = "numeralo_session_id";
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function deleteSessionId() {
  if (typeof window === "undefined") return;

  const SESSION_KEY = "numeralo_session_id";
  localStorage.removeItem(SESSION_KEY);
}
