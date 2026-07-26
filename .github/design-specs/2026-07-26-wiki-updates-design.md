# Wiki Update Feed Design

## Decision

Use Docusaurus's official blog support as a dedicated, bilingual Wiki update
feed. Keep it separate from the existing Lumina Studio product release notes.
Do not generate a public feed directly from raw Git commits or pull requests.

## User-facing structure

- Chinese update index: `/zh/updates/`
- English update index: `/en/updates/`
- Navbar labels: `Wiki 动态` and `Wiki Updates`
- Each update is a dated Markdown or MDX entry with a short summary and direct
  links to the affected public pages.
- The blog plugin provides chronological listing, pagination, tags, and
  RSS/Atom/JSON feeds.
- Documentation pages display their last update time through the official docs
  plugin. Author names remain hidden so Git account names are not presented as
  editorial attribution.

## First update

The first bilingual entry records the 2026-07-26 publication:

- 69 Chinese and 69 English interface-and-control references;
- the keychain-loop workflow tutorial;
- public authoring and contribution guidance.

The entry describes user-visible documentation changes only. It does not expose
internal repositories, infrastructure, automation, or private development
details.

## Content workflow

Future merged documentation work should add or update one reviewed Wiki update
entry when the change is meaningful to readers. Small typo fixes do not require
their own entry. Automation may prepare a draft from merged public changes, but
the published summary remains human-reviewed and must link only to public pages.

## Alternatives considered

1. **Official Docusaurus blog — selected.** Native dates, localization, tags,
   pagination, and feeds with no custom content engine.
2. **Generate a page from Git history — rejected.** Raw commits are noisy,
   implementation-oriented, and require custom generation and filtering.
3. **Reuse the product release log — rejected.** Software releases and Wiki
   editorial changes have different audiences and publication rhythms.

## Validation

- Build the Chinese and English locales.
- Confirm both update indexes and the first post are generated.
- Confirm localized navbar labels and update content.
- Confirm RSS, Atom, and JSON feed files are generated for both locales.
- Confirm existing product release-note routes remain unchanged.
- Check the public files for private paths, credentials, internal URLs, and
  mixed-language publication content.
