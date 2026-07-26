# Comments, Locale Routing, and Support Links

## Goal

Make existing comments survive a page refresh, prevent the language selector
from opening missing localized routes, point the repository link at the public
Lumina Studio project, and add clear regional support links.

The current transparent-coating and keychain-loop workflow tutorials will be
removed at the owner's request. They will be rewritten manually later.

## Confirmed diagnosis

### Comments

The Artalk database contains the reported comment and the public API returns it
when queried with the canonical page key. The browser does not request
`GET /api/v2/comments` after a full page load.

The site uses Artalk 2.9.1 with `remoteConfModifier` to preserve the current
Chinese or English UI locale. In this Artalk version, the presence of that
modifier skips the automatic initial comment fetch. A newly submitted comment
is inserted into the in-memory list, so it appears immediately, but a refresh
creates a new empty list and never reloads the saved comment.

### Locale routing

Twenty-one translated document pairs intentionally use different Chinese and
English slugs. Docusaurus' standard locale dropdown replaces the locale prefix
but preserves the remainder of the current pathname. For example:

- Chinese route: `/zh/docs/更新日志/`
- Real English route: `/en/docs/changelog/`
- Current dropdown target: `/en/docs/更新日志/` (missing)

Two newer workflow tutorials also lack reviewed English translations. Rather
than publish machine-translated replacements, both tutorials will be removed
until the owner supplies new source material.

## Design

### 1. Restore Artalk's initial list load

Keep the existing remote configuration and locale override. Bind one handler to
Artalk's `mounted` event and call `reload()` after the remote configuration has
been applied. Continue to mark the section ready only after `list-loaded`, and
show the existing failure message after `list-failed`.

The lifecycle binding will live in a focused helper used by the comment
component. A targeted regression test will prove that:

- `mounted` triggers exactly one initial reload;
- `list-loaded` marks the UI ready;
- `list-failed` marks the UI failed;
- cleanup detaches all handlers.

This fixes the current pinned Artalk version without disabling server-side UI
configuration or performing a broader client/server upgrade.

### 2. Preserve localized slugs with official redirects

Use `@docusaurus/plugin-client-redirects` at the same version as the Docusaurus
site. Add explicit bidirectional redirects for every translated document pair
whose Chinese and English slugs differ:

- the incorrect English path produced from a Chinese page redirects to the
  real English page;
- the incorrect Chinese path produced from an English page redirects to the
  real Chinese page.

This keeps all existing public URLs, uses the standard Docusaurus locale
dropdown, and avoids a custom language-switching component.

A route-contract test will cover the full mapping and reject duplicate source
routes. The production build will verify that redirect pages are emitted.

### 3. Remove the two pending-rewrite tutorials

Delete only:

- `docs/tutorials/transparent-coating/`
- `docs/tutorials/keychain-loop/`

Their local tutorial assets are deleted with the pages. The separate control
reference pages under `docs/reference/model-features/` remain available.

### 4. Update project and support navigation

Change the navbar GitHub link to:

`https://github.com/lumina-layer-studio/Lumina-Layers`

Add a standard Docusaurus dropdown:

- Chinese label: `支持项目`
- English label: `Support`
- Mainland China: `https://ifdian.net/a/MMMINNN`
- International: `https://www.patreon.com/cw/Lumina_studio`

Add a compact support section below the homepage feature cards with the same
two destinations. All user-visible labels and descriptions use Docusaurus'
translation system and work in both light and dark themes.

## Verification

1. Run the focused Node tests and observe the regression tests fail before the
   implementation, then pass after it.
2. Run `yarn typecheck`.
3. Run `ARTALK_SERVER=https://comments.luminastudio.com.cn yarn build`.
4. Confirm both removed tutorial routes are absent from the generated site.
5. Confirm every wrong cross-locale slug emits a redirect page to its real
   counterpart.
6. Serve the production build locally and verify:
   - the saved public comment appears after reload;
   - Changelog and other localized routes switch languages without a 404;
   - GitHub opens the public Lumina Studio project;
   - both support destinations are visible from the navbar and homepage;
   - mobile navigation and dark mode remain readable.
7. Scan changed files for secrets, machine-local paths, mixed-language content,
   and broken links.

## Out of scope

- Publishing replacement versions of the two deleted tutorials.
- Upgrading the Artalk server or migrating its database.
- Changing existing canonical Chinese or English document URLs.
- Adding account, server, NAS, CDN, or deployment details to the public
  repository.
