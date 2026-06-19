/*
 * Pre-paint script — v2 has no theme switcher (light/dark via
 * prefers-color-scheme only) and no accent picker. This file is now a
 * no-op kept around because BaseLayout still injects it via `?raw` —
 * removing the import would mean touching every layout. Future work can
 * delete this file once the BaseLayout import is dropped.
 */
;(() => {
  /* intentionally empty — manuscript palette is single-themed. */
})()
