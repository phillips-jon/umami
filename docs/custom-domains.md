# Custom Tracking Domains

Custom domains let you serve Umami's tracking script and API from a first-party subdomain (e.g. `t.yourdomain.com` instead of `stats.yourserver.com`). This prevents ad blockers from intercepting analytics requests and gives each tracked site its own branded tracking endpoint.

## How it works

1. You register a subdomain in Website Settings → Custom Domains
2. Umami shows you the CNAME record to add at your DNS provider
3. You click Verify once the DNS record has propagated
4. The verified domain appears as a selectable option in your tracking code snippet, link creation form, and pixel creation form
5. Your reverse proxy (Caddy, Nginx, or Cloudflare) must already be configured to accept that hostname and proxy it to your Umami instance

Umami does **not** provision SSL certificates or create DNS records automatically. Those are infrastructure concerns handled outside the app.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ENABLE_CUSTOM_DOMAINS` | _(unset)_ | Set to any non-empty value to enable the feature |
| `CUSTOM_DOMAIN_CNAME_TARGET` | Hostname from `APP_URL` | The hostname your custom domains should CNAME to |

### Example `.env`

```
ENABLE_CUSTOM_DOMAINS=true
APP_URL=https://stats.yourserver.com
# Optional — defaults to the hostname of APP_URL:
# CUSTOM_DOMAIN_CNAME_TARGET=stats.yourserver.com
```

## Reverse Proxy Setup

Your server must accept HTTPS traffic on custom hostnames and proxy it to the Umami process. Choose one of the options below.

### Option A: Caddy (Recommended)

Caddy provisions SSL certificates automatically via ACME. Add all custom hostnames to the site block alongside your primary domain:

```caddyfile
t.oversizedhour.com, t.dailyphototips.com, stats.yourserver.com {
    reverse_proxy localhost:3000
}
```

Reload Caddy after adding new domains: `systemctl reload caddy`

Alternatively, use Caddy's [admin API](https://caddyserver.com/docs/api) to add domains dynamically without reloading the entire config.

### Option B: Nginx + Certbot

Add each new custom hostname to your existing server block and expand the certificate.

```nginx
server {
    listen 443 ssl;
    server_name stats.yourserver.com t.oversizedhour.com t.dailyphototips.com;

    ssl_certificate     /etc/letsencrypt/live/stats.yourserver.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stats.yourserver.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After updating `server_name`, expand your certificate:

```bash
certbot certonly --nginx \
  -d stats.yourserver.com \
  -d t.oversizedhour.com \
  -d t.dailyphototips.com
nginx -s reload
```

### Option C: Cloudflare for SaaS

[Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/) handles SSL automatically and works without touching your origin server. Use the Custom Hostnames API to register each verified domain.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/custom_hostnames" \
  -H "Authorization: Bearer {CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "t.oversizedhour.com", "ssl": {"method": "http", "type": "dv"}}'
```

The user's DNS provider points `t.oversizedhour.com` CNAME to your Cloudflare zone's `fallback_origin` hostname.

## DNS Setup (User Side)

After adding a domain in Umami, the UI shows the CNAME record to create:

```
t.oversizedhour.com  CNAME  stats.yourserver.com
```

Add this record at your domain registrar or DNS provider. Most providers apply changes within minutes, but propagation can take up to 48 hours. Click **Verify** in the Umami UI to check.

## Troubleshooting

**Verification fails immediately**

- Confirm the CNAME record exists: `dig CNAME t.oversizedhour.com`
- Check the record points to the hostname in `CUSTOM_DOMAIN_CNAME_TARGET` (or your `APP_URL` hostname)
- Wait a few minutes and try again — DNS TTL may be caching the old response

**Verification passes but tracking requests still fail**

- Confirm your reverse proxy accepts requests on the custom hostname
- Check SSL: visit `https://t.oversizedhour.com/script.js` in a browser
- Look at Umami server logs for requests arriving on that hostname

**`CNAME target is not configured` error**

- Set `APP_URL` or `CUSTOM_DOMAIN_CNAME_TARGET` in your environment

**`Custom domains are not enabled` error**

- Set `ENABLE_CUSTOM_DOMAINS=true` and restart the Umami process

## Database Migration

When you first enable this feature, run the Prisma migration to create the `custom_domain` table:

```bash
pnpm prisma migrate deploy
```

Or if you're in development:

```bash
pnpm prisma migrate dev
```

The migration is safe to run on existing installations — it only adds new tables and columns.
