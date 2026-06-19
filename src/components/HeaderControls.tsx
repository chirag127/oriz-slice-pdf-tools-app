/*
 * Header controls — minimal v2 cluster. The v2 brief drops the theme/accent
 * picker (light/dark via prefers-color-scheme only) and the ⌘K family
 * search modal. What remains is a single small-caps "sign in" link
 * matching the rest of the chrome.
 *
 * Kept as a React island even though it's static — the rest of the family
 * uses the same shape, and tools/account state will eventually mount here.
 */
export default function HeaderControls() {
  return (
    <a className="hd-signin" href="/account/" aria-label="Sign in">
      sign in
      <style>{`
        .hd-signin {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding-inline: 0.875rem;
          height: 32px;
          font-family: var(--font-serif);
          font-size: 13px;
          font-feature-settings: 'smcp' 1;
          letter-spacing: 0.1em;
          color: var(--margin);
          text-decoration: none;
          border: 1px solid var(--rule);
          border-radius: 2px;
          background: transparent;
        }
        .hd-signin:hover {
          color: var(--ledger);
          border-color: var(--ledger);
        }
        .hd-signin:focus-visible {
          outline: 2px solid var(--ledger);
          outline-offset: 2px;
        }
      `}</style>
    </a>
  )
}
