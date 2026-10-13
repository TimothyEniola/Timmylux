const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const hasBody = options.body !== undefined;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: hasBody && !isFormData && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
    });
  } catch (networkError) {
    const error = new Error("The server is unavailable right now. Please try again in a moment.");
    error.status = 0;
    throw error;
  }

  const rawText = await response.text().catch(() => "");
  let payload = {};

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { message: rawText };
    }
  }

  if (!response.ok || payload.success === false) {
    const message = payload.message || payload.error || payload.detail || "The request could not be completed.";
    const error = new Error(typeof message === "string" ? message : "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return payload;
}