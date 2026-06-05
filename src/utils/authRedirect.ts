const ALLOWED_PREFIXES = [
  "/lich-su-dat-ve",
  "/thong-tin-tai-khoan",
  "/thay-doi-mat-khau",
] as const;

/** Map email link `/orders/:ref` to in-app order detail route. */
function mapOrdersPath(path: string): string | null {
  const match = /^\/orders\/([^/?#]+)\/?$/.exec(path);
  if (!match) return null;
  return `/lich-su-dat-ve/${encodeURIComponent(match[1])}`;
}

/**
 * Returns a same-origin relative path safe for post-login navigation, or null.
 */
export function resolveSafeAuthRedirect(
  raw: string | null | undefined
): string | null {
  if (!raw?.trim()) return null;

  let path = raw.trim();
  if (path.includes("://") || path.startsWith("//")) return null;

  const ordersMapped = mapOrdersPath(path);
  if (ordersMapped) path = ordersMapped;

  if (!path.startsWith("/")) return null;

  const allowed = ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
  return allowed ? path : null;
}
