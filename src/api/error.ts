/**
 * Extract a human-readable error message from an Axios error response.
 *
 * Handles:
 * - FastAPI HTTPException: { detail: "string" }
 * - FastAPI 422 validation: { detail: [{ msg: "...", ... }, ...] }
 * - Generic fallback
 */
export function getErrorDetail(err: any, fallback: string): string {
  const detail = err?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((e: any) => e.msg || String(e)).join('; ') || fallback
  }
  if (typeof detail === 'string' && detail) {
    return detail
  }
  return fallback
}
