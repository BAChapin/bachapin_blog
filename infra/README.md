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
│       ├── blog.conf.template
│       └── umami.conf.template
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

## HTTPS

The NGINX configs are production HTTPS configs. Port `80` redirects to `443`, and NGINX
expects Let's Encrypt certificates to exist on the droplet at:

```txt
/etc/letsencrypt/live/bachapin.me/fullchain.pem
/etc/letsencrypt/live/bachapin.me/privkey.pem

/etc/letsencrypt/live/analytics.bachapin.me/fullchain.pem
/etc/letsencrypt/live/analytics.bachapin.me/privkey.pem
```

The compose file mounts the host certificate directory into the NGINX container:

```yaml
- /etc/letsencrypt:/etc/letsencrypt:ro
```

If you need to request certificates before the stack is running, use Certbot standalone on
the droplet:

```bash
sudo certbot certonly --standalone -d bachapin.me
sudo certbot certonly --standalone -d analytics.bachapin.me
```

After renewing certificates, reload NGINX:

```bash
docker compose exec nginx nginx -s reload
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

## GitHub Actions Deployment

This repository includes a tag-triggered GitHub Actions workflow at
`.github/workflows/deploy.yml`.

The workflow runs when you push a tag matching `v*`, for example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

It will:

- Install dependencies with `npm ci`
- Run `npm run check`
- Run `npm run build`
- Package `infra/` plus the generated Astro `dist/` output
- Upload the bundle to your DigitalOcean droplet over SSH
- Run `docker compose pull` and `docker compose up -d --remove-orphans`

### Required GitHub Secrets

Add these in GitHub under `Settings -> Secrets and variables -> Actions`:

```txt
DO_HOST
DO_SSH_USER
DO_SSH_PRIVATE_KEY
SITE_URL
PUBLIC_UMAMI_ENABLED
PUBLIC_UMAMI_WEBSITE_ID
PUBLIC_UMAMI_SRC
```

Optional:

```txt
DO_DEPLOY_PATH
```

If `DO_DEPLOY_PATH` is not set, the workflow deploys to:

```txt
/opt/bachapin_blog
```

### DigitalOcean Server Setup

On the Ubuntu droplet:

1. Make sure Docker and Docker Compose are installed.
2. Create the deploy directory:

```bash
sudo mkdir -p /opt/bachapin_blog
sudo chown -R "$USER":"$USER" /opt/bachapin_blog
```

3. Create the production environment file:

```bash
mkdir -p /opt/bachapin_blog/infra
nano /opt/bachapin_blog/infra/.env
```

Use `infra/.env.example` as the template. Keep this `.env` file on the server only.

4. Add a deploy SSH key:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Put the public key that matches `DO_SSH_PRIVATE_KEY` into `authorized_keys`.

5. Make sure the firewall allows HTTP and HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Notes

- The workflow does not create or manage DigitalOcean droplets.
- The workflow assumes a small VPS-style deployment where Docker Compose runs directly on the droplet.
- Keep production secrets in GitHub Actions secrets and in the server-side `/opt/bachapin_blog/infra/.env`.
- The server-side `.env` is intentionally not copied from the repository during deployment.
