# Blog Infrastructure

Simple Docker Compose infrastructure for a personal Astro blog and self-hosted Umami analytics.

## Services

- `nginx`: public reverse proxy on ports `80` and `443`
- `umami`: internal Umami analytics app on Docker networking only
- `postgres`: private PostgreSQL database for Umami

Postgres is not exposed publicly. Umami is not published directly to the host; all public traffic goes through NGINX.

## Directory Layout

```txt
infra/
├── docker-compose.yml
├── .env.example
├── README.md
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── blog.conf
│       └── umami.conf
└── data/
    └── .gitkeep
```

## Configure Environment

From the `infra` directory:

```bash
cp .env.example .env
```

Edit `.env` and replace the example values:

```env
POSTGRES_DB=umami
POSTGRES_USER=umami
POSTGRES_PASSWORD=change_me

DATABASE_URL=postgresql://umami:change_me@postgres:5432/umami

UMAMI_APP_SECRET=change_me_to_long_random_string

DOMAIN=example.com
UMAMI_DOMAIN=analytics.example.com
```

Generate a strong Umami app secret:

```bash
openssl rand -base64 32
```

Use the same database password in both `POSTGRES_PASSWORD` and `DATABASE_URL`.

## Start the Stack

```bash
docker compose up -d
```

Check status:

```bash
docker compose ps
```

## View Logs

All services:

```bash
docker compose logs -f
```

One service:

```bash
docker compose logs -f nginx
docker compose logs -f umami
docker compose logs -f postgres
```

## Stop the Stack

```bash
docker compose down
```

To stop and remove the PostgreSQL volume too:

```bash
docker compose down -v
```

Only use `-v` when you intentionally want to delete the database.

## Back Up Postgres

Create a timestamped SQL dump from the running database:

```bash
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > umami-backup-$(date +%Y%m%d-%H%M%S).sql
```

Restore from a dump:

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB" < umami-backup.sql
```

## DNS on Squarespace

Point your root domain at the VPS:

```txt
Type: A
Host: @
Value: YOUR_VPS_PUBLIC_IP
TTL: Default
```

Point the analytics subdomain at the same VPS. Use either an `A` record:

```txt
Type: A
Host: analytics
Value: YOUR_VPS_PUBLIC_IP
TTL: Default
```

Or a `CNAME` if your DNS setup already has a canonical host:

```txt
Type: CNAME
Host: analytics
Value: example.com
TTL: Default
```

## Local HTTP Testing

The provided NGINX configs listen on HTTP port `80` by default so you can test before adding certificates.

To test locally without public DNS, add temporary entries to your local `/etc/hosts` file:

```txt
127.0.0.1 example.com
127.0.0.1 analytics.example.com
```

Then visit:

- `http://example.com`
- `http://analytics.example.com`

## Adding SSL Later

The NGINX config files include commented HTTPS server blocks. A common Ubuntu setup is:

1. Install Certbot on the host.
2. Issue certificates for both domains.
3. Mount `/etc/letsencrypt` into the NGINX container as read-only.
4. Uncomment the HTTPS server blocks in `nginx/conf.d/blog.conf` and `nginx/conf.d/umami.conf`.
5. Reload NGINX:

```bash
docker compose exec nginx nginx -s reload
```

The compose file already includes a commented example for the certificate mount:

```yaml
# - /etc/letsencrypt:/etc/letsencrypt:ro
```

## Deploying Astro Static Output

NGINX serves static blog files from:

```txt
infra/data
```

From the project root, build Astro and copy the generated output into that directory:

```bash
npm run build
cp -R dist/. infra/data/
```

Then start or reload the infra stack:

```bash
cd infra
docker compose up -d
docker compose exec nginx nginx -s reload
```

The blog route is:

```txt
http://example.com
```

Umami is routed separately:

```txt
http://analytics.example.com
```
