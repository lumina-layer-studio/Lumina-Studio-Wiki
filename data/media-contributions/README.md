# Media contribution records

New tutorial media is registered here after the contributor has opened a draft
pull request and completed the Lumina Studio media handoff. The handoff returns
an opaque signed receipt; it does not require contributors to place original
videos, project archives, or other large source files in Git.

Each tutorial uses one `<tutorial-id>.json` record. Public validation checks:

- matching Chinese and English tutorial pages;
- contributor attribution and rights declarations;
- the signed receipt and the original-file hashes it covers;
- the hash of every published web image;
- approved Bilibili or YouTube links for videos;
- the absence of local, account, or personal information.

Do not copy a record from another tutorial. Start with a draft pull request and
follow the media instructions shown during review. Existing media published
before this contract is listed in `legacy-assets.json`; contributors must not
edit that registry.
