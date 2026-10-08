# AliceLabs — editable landing templates

Seven source-driven landing structures with a commercial catalogue, distinct industry copy/colors, responsive layouts and draft-email inquiries. Demo brands are fictitious and every demo is labelled and noindex. There are no invented clients, testimonials, subscriptions or payment flows.

## Build and preview

```sh
npm ci
npm test
python3 -m http.server 3000 --directory dist
```

Node 22+; no runtime or build dependencies. Publish **dist/**, including its assets and template subfolders. Relative links work at a domain root or a project subpath. Do not publish the repository root or archive.

## Editable source

- `data/templates.json`: seven configurations: consulting, agency, education, wellness, real estate, SaaS and startup.
- `templates/page.html`: shared semantic demo structure.
- `templates/catalog.html`: commercial selection page.
- `assets/site.css`: responsive layout and color tokens.
- `assets/catalog.js`: sector filter only; no analytics or form transmission.
- `scripts/build.mjs`: deterministic static generation with escaped content and validated slugs/colors.
- `scripts/verify.mjs`: output, route/anchor and demo-status checks.

Edit the JSON and HTML/CSS, then run `npm test`. These are marketing page templates, not the applications described by their sectors. Payment, CRM, bookings, course platforms, medical services, MLS and SaaS backends require separately scoped implementation.

## Why the previous exports moved

`archive/legacy/` preserves the original compiled Vite exports for reference. Original React/TypeScript component sources were not present. Those exports used root-relative `/assets` paths despite being linked from subfolders. Their original marketing claims are not validated. They are excluded from the new deployment artifact; this project supplies new maintainable source rather than editing minified bundles or pretending to recover missing source.

## Commercial use

Customers choose a structure and request an adaptation by email to contact@alicelabs.site. The link opens a draft; it does not send a message or record a lead. Price, scope, timeline, content permissions and acceptance are agreed in a proposal. See `docs/DELIVERY-CHECKLIST.md`.

CI builds/tests and uploads `landing-catalog`. It does not publish production or contact customers.
