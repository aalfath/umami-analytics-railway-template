# Umami for Railway: the official image, pinned by version and digest.
# Upstream: https://github.com/umami-software/umami (release v3.5.0)
FROM ghcr.io/umami-software/umami:3.5.0@sha256:b64f40400d77bcadd39cf5c62a1e368c99524ca442024f96e1133355a19a5dbc

# bcryptjs (same version Umami 3.5.0 uses) in its own folder, only for the
# first-start admin password step. Umami bundles its own copy into the server.
USER root
RUN mkdir -p /opt/railway \
    && cd /opt/railway \
    && echo '{"private":true}' > package.json \
    && pnpm add bcryptjs@3.0.3 \
    && chown -R nextjs:nodejs /opt/railway

COPY --chown=nextjs:nodejs railway-start.sh /app/scripts/railway-start.sh
COPY --chown=nextjs:nodejs railway-admin-password.mjs /app/scripts/railway-admin-password.mjs

USER nextjs

ENV HOSTNAME=0.0.0.0 \
    PORT=3000

EXPOSE 3000

CMD ["sh", "scripts/railway-start.sh"]
