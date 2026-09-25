import { cleanAttribution, UTM_KEYS, type Attribution } from "./validation";

const KEY = "kredance:first-touch:v1";
let memory: Attribution | undefined;

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return cleanAttribution(null);
  if (memory) return memory;
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return (memory = cleanAttribution(JSON.parse(saved)));
  } catch {
    /* Private browsing still supports the in-memory fallback. */
  }
  const params = new URLSearchParams(window.location.search);
  let referrerHost = "";
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    /* Ignore malformed referrers. */
  }
  memory = cleanAttribution({
    landingPath: window.location.pathname,
    referrerHost,
    utm: Object.fromEntries(UTM_KEYS.map((key) => [key, params.get(key)])),
  });
  try {
    sessionStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* Storage is optional. */
  }
  return memory;
}
