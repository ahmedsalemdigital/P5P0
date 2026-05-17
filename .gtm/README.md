# GTM container — as code

`container.json` is the GTM container configuration for **`GTM-THK4XJZW`**,
generated from the tracking plan in [`/ANALYTICS.md`](../ANALYTICS.md) by
[`scripts/gen-gtm-container.mjs`](../scripts/gen-gtm-container.mjs).

It defines everything `/ANALYTICS.md §2.2 – §2.5` walks through manually:
27 data-layer variables, 13 custom-event triggers, and 14 tags
(1 Google Tag base config + 12 GA4 Event tags + 1 user-properties tag).

## Importing into GTM

This is a one-shot replacement for the manual `§2.2 – §2.4` clicking.

1. Open [tagmanager.google.com](https://tagmanager.google.com/) and select
   container **`GTM-THK4XJZW`**.
2. **Admin → Import Container**.
3. Choose `container.json` from this directory.
4. Workspace: **Default Workspace** (or create a new one if you want a
   safety net).
5. Import option: **Merge** with **Rename conflicting tags, triggers, and
   variables**. ("Overwrite" wipes existing config; merge is safer.)
6. Confirm the preview (27 variables, 13 triggers, 14 tags being added).
7. After import, open **Tags → `GA4 — Google tag (base config)`**. Verify
   its trigger is set to **Initialization - All Pages**. If GTM didn't
   auto-resolve the built-in trigger (`2147479573`) on import, set it
   manually here.
8. **Submit** the workspace as a new version and **Publish** when ready.

## GA4 console — still manual

GA4 has no equivalent import. Follow `/ANALYTICS.md §2.6 – §2.8` for
custom dimensions, custom metrics, key events, and retention. ~15 min
of clicking; not worth wiring up the GA4 Admin API for a single
property.

## Re-generating after the tracking plan changes

1. Edit `EVENT_PARAMS` / `USER_PROPERTIES` in
   [`scripts/gen-gtm-container.mjs`](../scripts/gen-gtm-container.mjs).
2. `npm run docs:gtm` → rewrites `.gtm/container.json`.
3. Re-import into GTM (the merge step will add new vars/triggers/tags
   without disturbing existing ones).

Don't hand-edit `container.json` — the script overwrites it.
