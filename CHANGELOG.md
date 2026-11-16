# Changelog

Each entry is one version of this Railway template. Breaking changes come first.
Railway shows deployers an "update available" notice when `main` changes; read the
entry before you apply it.

## 3.5.0-1 (2026-11-16)

- README: add the Deploy on Railway button for the published template (`umami-3`). No change to the deployed app.

## 3.5.0 (2026-11-16)

- First release of the template: Umami 3.5.0
  (`ghcr.io/umami-software/umami:3.5.0@sha256:b64f40400d77bcadd39cf5c62a1e368c99524ca442024f96e1133355a19a5dbc`)
  with Railway Postgres.
- The seeded `admin` account gets the generated `ADMIN_PASSWORD` on first start,
  instead of Umami's default password `umami`.
