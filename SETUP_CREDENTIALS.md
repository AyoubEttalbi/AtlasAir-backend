# 🔐 Setup Instructions for Local Development

## Important: Configure Your Credentials

Before running the application, you need to set up your environment variables with your actual credentials.

### Step 1: Create Your Local Environment File

Copy the example file to create your local `.env.docker`:

```bash
cp .env.example .env.docker
```

### Step 2: Edit `.env.docker` with Your Credentials

Open `.env.docker` and replace the placeholders:

```bash
# Database Oracle
DB_USERNAME=ayoub                    # Your actual database username
DB_PASSWORD=Ayoubettalbi2004         # Your actual database password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production  # Generate a secure random string
```

### Step 3: Run Docker Compose

```bash
docker-compose up -d
```

---

## 🔒 Security Checklist

Before pushing to GitHub, make sure:

- [ ] `.env` is in `.gitignore` (already done ✅)
- [ ] `.env.docker` contains only YOUR credentials (not committed)
- [ ] `.env.example` has placeholders only (safe to commit ✅)
- [ ] `docker-compose.yml` uses environment variables (done ✅)
- [ ] `README.md` has no real passwords (done ✅)

---

## 📤 What to Commit to GitHub

**Safe to commit:**
- ✅ `README.md`
- ✅ `.env.example`
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `.dockerignore`
- ✅ `DOCKER_SETUP.md`

**Never commit:**
- ❌ `.env`
- ❌ `.env.docker` (if it has your real credentials)
- ❌ `node_modules/`
- ❌ Database data

---

## 👥 For Your Teammates

When they clone the repo, they should:

1. Copy `.env.example` to `.env.docker`
2. Edit `.env.docker` with their own credentials
3. Run `docker-compose up -d`

That's it! 🚀
