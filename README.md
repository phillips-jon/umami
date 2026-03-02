<p align="center">
  <img src="https://content.umami.is/website/images/umami-logo.png" alt="Umami Logo" width="100">
</p>

<h1 align="center">Umami</h1>

<p align="center">
  <i>Umami is a simple, fast, privacy-focused alternative to Google Analytics.</i>
</p>

<p align="center">
  <a href="https://github.com/umami-software/umami/releases"><img src="https://img.shields.io/github/release/umami-software/umami.svg" alt="GitHub Release" /></a>
  <a href="https://github.com/umami-software/umami/blob/master/LICENSE"><img src="https://img.shields.io/github/license/umami-software/umami.svg" alt="MIT License" /></a>
  <a href="https://github.com/umami-software/umami/actions"><img src="https://img.shields.io/github/actions/workflow/status/umami-software/umami/ci.yml" alt="Build Status" /></a>
  <a href="https://analytics.umami.is/share/LGazGOecbDtaIwDr/umami.is" style="text-decoration: none;"><img src="https://img.shields.io/badge/Try%20Demo%20Now-Click%20Here-brightgreen" alt="Umami Demo" /></a>
</p>

---

## 🍴 Fork Changes

This is a fork of [umami-software/umami](https://github.com/umami-software/umami) with the following additions:

### Custom Tracking Domains

Allows each tracked website to use a custom subdomain (e.g. `t.yourdomain.com`) for tracking scripts and link URLs, so analytics requests appear first-party and are less likely to be blocked by ad blockers.

- Add and remove custom domains per website under **Website Settings → Custom Domains**
- One-click DNS verification (checks that your subdomain CNAMEs to the Umami host)
- Verified domains appear as selectable options in the tracking code snippet and link creation form
- Feature is opt-in via environment variable:

```bash
ENABLE_CUSTOM_DOMAINS=true
CUSTOM_DOMAIN_CNAME_TARGET=your-umami-hostname.com  # defaults to APP_URL hostname
```

Your reverse proxy (Caddy, Nginx, Cloudflare, etc.) must be configured to accept requests on the custom hostnames. SSL termination is handled at the infrastructure level, not by Umami. See [`docs/custom-domains.md`](docs/custom-domains.md) for infrastructure setup examples.

### Editable Link Slugs

When creating or editing a tracked link, you can now type a custom slug instead of always getting an auto-generated one. The slug field is editable inline with the base URL shown as a prefix. The refresh button still generates a random slug if you prefer. Slugs must contain only letters, numbers, hyphens, and underscores.

### Link URLs Without `/q/` Prefix

Tracked links now resolve at `/:slug` (e.g. `go.yourdomain.com/my-campaign`) instead of `/:slug` previously at `/q/:slug`. Any existing `/q/:slug` URLs redirect permanently (301) to the new path.

### Bulk Link Import

Import multiple tracked links at once from a CSV file via **Links → Import Links**.

Supported CSV columns (header names are case-insensitive, parenthetical notes like "(optional)" are ignored):

| Column | Required | Description |
|---|---|---|
| `Name` | Yes | Display name for the link |
| `Destination URL` | Yes | The URL to redirect to |
| `Tracking Domain` | No | A verified custom domain to use for this link |
| `Link Slug` | No | Custom slug; auto-generated if omitted |

The import dialog shows a preview table before submitting. Rows with validation errors are flagged and skipped; valid rows are imported immediately.

---

## 🚀 Getting Started

A detailed getting started guide can be found at [umami.is/docs](https://umami.is/docs/).

---

## 🛠 Installing from Source

### Requirements

- A server with Node.js version 18.18+.
- A PostgreSQL database version v12.14+.

### Get the source code and install packages

```bash
git clone https://github.com/umami-software/umami.git
cd umami
pnpm install
```

### Configure Umami

Create an `.env` file with the following:

```bash
DATABASE_URL=connection-url
```

The connection URL format:

```bash
postgresql://username:mypassword@localhost:5432/mydb
```

### Build the Application

```bash
pnpm run build
```

The build step will create tables in your database if you are installing for the first time. It will also create a login user with username **admin** and password **umami**.

### Start the Application

```bash
pnpm run start
```

By default, this will launch the application on `http://localhost:3000`. You will need to either [proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly.

---

## 🐳 Installing with Docker

Umami provides Docker images as well as a Docker compose file for easy deployment.

Docker image:

```bash
docker pull docker.umami.is/umami-software/umami:latest
```

Docker compose (Runs Umami with a PostgreSQL database):

```bash
docker compose up -d
```

---

## 🔄 Getting Updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
pnpm install
pnpm build
```

To update the Docker image, simply pull the new images and rebuild:

```bash
docker compose pull
docker compose up --force-recreate -d
```

---

## 🛟 Support

<p align="center">
  <a href="https://github.com/umami-software/umami"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=github" alt="GitHub" /></a>
  <a href="https://twitter.com/umami_software"><img src="https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter" alt="Twitter" /></a>
  <a href="https://linkedin.com/company/umami-software"><img src="https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin" alt="LinkedIn" /></a>
  <a href="https://umami.is/discord"><img src="https://img.shields.io/badge/Discord--blue?style=social&logo=discord" alt="Discord" /></a>
</p>

[release-shield]: https://img.shields.io/github/release/umami-software/umami.svg
[releases-url]: https://github.com/umami-software/umami/releases
[license-shield]: https://img.shields.io/github/license/umami-software/umami.svg
[license-url]: https://github.com/umami-software/umami/blob/master/LICENSE
[build-shield]: https://img.shields.io/github/actions/workflow/status/umami-software/umami/ci.yml
[build-url]: https://github.com/umami-software/umami/actions
[github-shield]: https://img.shields.io/badge/GitHub--blue?style=social&logo=github
[github-url]: https://github.com/umami-software/umami
[twitter-shield]: https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter
[twitter-url]: https://twitter.com/umami_software
[linkedin-shield]: https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin
[linkedin-url]: https://linkedin.com/company/umami-software
[discord-shield]: https://img.shields.io/badge/Discord--blue?style=social&logo=discord
[discord-url]: https://discord.com/invite/4dz4zcXYrQ
