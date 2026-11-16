# Umami on Railway

A Railway template for [Umami](https://umami.is), the open-source, privacy-focused web analytics app.

It deploys:

| Service | Source | Notes |
|---|---|---|
| `Umami` | this repo's `Dockerfile` (the official image `ghcr.io/umami-software/umami:3.5.0`, pinned by digest) | Public web app on port 3000, health check `/api/heartbeat` |
| `Postgres` | Railway's PostgreSQL | All Umami data; on a volume |

Umami itself keeps no files, so the app service needs no volume.

## Variables

| Variable | Default | What it does |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Connection to the Postgres service over the private network |
| `APP_SECRET` | generated secret | Signs login tokens. Changing it logs everyone out |
| `ADMIN_PASSWORD` | generated secret | Password for the `admin` user, set on first start |
| `PORT` | `3000` | Port Umami listens on |

### First login

Log in as `admin` with the `ADMIN_PASSWORD` value from the Umami service's **Variables** tab.

On first start, `railway-start.sh` replaces Umami's seeded password (`umami`) with `ADMIN_PASSWORD`, but only while the account still has that seeded password. So a password you change later in Umami (**Settings → Profile → Change password**) is never overwritten, and editing `ADMIN_PASSWORD` after the first start has no effect. If you clear `ADMIN_PASSWORD` before the first start, Umami keeps `admin` / `umami` and asks you to change it at first login.

### Optional settings

Add these to the Umami service only if you need them. The full list is in [Umami's environment variables docs](https://umami.is/docs/environment-variables).

- `TRACKER_SCRIPT_NAME`: serve the tracker under another file name, to avoid ad blockers.
- `REDIS_URL`: use Redis for caching and login sessions (add a Railway Redis service and reference it).
- `DISABLE_TELEMETRY=1`: stop Umami's anonymous telemetry ping.
- `TRUSTED_PROXIES`: client IP detection behind more than one proxy.

## How updates reach you

Railway builds the `Umami` service from this repo. When `main` changes (for example a new Umami version), Railway shows an "update available" notice on your project, and you choose when to apply it. Read [CHANGELOG.md](CHANGELOG.md) first. Umami runs its database migrations at start, so take a Postgres backup before a major version update.

## Files

- `Dockerfile`: the pinned official image, plus `bcryptjs` for the password step.
- `railway-start.sh`: Umami's own start steps (database check and migrations, tracker update, server), plus the admin password step.
- `railway-admin-password.mjs`: sets the `admin` password from `ADMIN_PASSWORD` while it's still the seeded one.

## Run it locally

```sh
docker compose up --build
```

Then open http://localhost:3000 and log in as `admin` with the password from `docker-compose.yml`.

## License

The template files are MIT licensed. Umami is MIT licensed by Umami Software, Inc.
