# 🐳 Docker Setup Guide - AtlasAir Flight Booking System

This guide will help you run the complete AtlasAir flight booking system using Docker.

## 📋 Prerequisites

- **Docker Desktop** installed and running
  - Download from: https://www.docker.com/products/docker-desktop
  - Minimum 4GB RAM allocated to Docker
  - At least 10GB free disk space

## 🏗️ Architecture

The Docker setup includes three services:

1. **Oracle Database 21c XE** - Database server (Port 1521)
2. **Backend API** - NestJS application (Port 3000)
3. **Frontend** - React application with Nginx (Port 5173)

## 🚀 Quick Start

### 1. Navigate to Backend Directory

```bash
cd "c:\Users\ayoub\OneDrive\المستندات\school\work\AtlasAir-backend"
```

### 2. Start All Services

```bash
docker-compose up -d
```

This command will:
- Download Oracle Database image (~2GB)
- Build backend Docker image
- Build frontend Docker image
- Start all services in the background

### 3. Check Service Status

```bash
docker-compose ps
```

You should see all three services running:
- `atlasair-oracle-db` - healthy
- `atlasair-backend` - up
- `atlasair-frontend` - up

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f oracle-db
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Oracle Database**: localhost:1521 (Service: XEPDB1)

## 🔧 Database Setup

The Oracle database will be automatically initialized on first run. However, you may need to run your database migrations/seeds.

### Run Database Migrations

```bash
# Access backend container
docker-compose exec backend sh

# Inside container, run migrations
npm run seed

# Exit container
exit
```

### Connect to Oracle Database

**Credentials:**
- Host: localhost
- Port: 1521
- Service Name: XEPDB1
- Username: ayoub
- Password: Ayoubettalbi2004

**Using SQL*Plus (from container):**
```bash
docker-compose exec oracle-db sqlplus ayoub/Ayoubettalbi2004@XEPDB1
```

## 🛠️ Common Commands

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Restart a Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### View Resource Usage
```bash
docker stats
```

## 🐛 Troubleshooting

### Backend Can't Connect to Database

**Issue**: Backend shows database connection errors

**Solution**:
1. Wait for Oracle DB to be fully healthy (can take 1-2 minutes)
2. Check database health: `docker-compose ps`
3. Restart backend: `docker-compose restart backend`

### Port Already in Use

**Issue**: Error binding to port 3000, 3001, or 1521

**Solution**:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Frontend on port 8080
  - "8081:3000"  # Backend on port 8081
```

### Out of Disk Space

**Issue**: Docker build fails due to disk space

**Solution**:
```bash
# Remove unused images and containers
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Oracle Database Won't Start

**Issue**: Oracle container keeps restarting

**Solution**:
1. Ensure Docker has at least 4GB RAM
2. Remove existing volume and restart:
```bash
docker-compose down -v
docker-compose up -d
```

### Frontend Shows 502 Bad Gateway

**Issue**: Nginx can't reach backend

**Solution**:
1. Ensure backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Restart services: `docker-compose restart`

## 📝 Environment Variables

To customize configuration, edit `.env.docker` file before starting:

```env
# Database
DB_PASSWORD=YourSecurePassword

# JWT
JWT_SECRET=your-secret-key-here

# Email (optional)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
```

Then use it in docker-compose:
```bash
docker-compose --env-file .env.docker up -d
```

## 🔄 Development Workflow

### Making Code Changes

**Backend Changes:**
```bash
# Rebuild and restart backend
docker-compose up -d --build backend
```

**Frontend Changes:**
```bash
# Rebuild and restart frontend
docker-compose up -d --build frontend
```

### Accessing Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec oracle-db bash
```

## 📊 Monitoring

### Check Container Health
```bash
docker-compose ps
```

### View Real-time Logs
```bash
docker-compose logs -f --tail=100
```

### Inspect Container
```bash
docker inspect atlasair-backend
```

## 🧹 Cleanup

### Remove Everything
```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (database data)
docker-compose down -v

# Remove images
docker rmi atlasair-backend atlasair-frontend
```

## 🎯 Production Considerations

Before deploying to production:

1. **Change default passwords** in docker-compose.yml
2. **Use environment files** for sensitive data
3. **Enable HTTPS** with reverse proxy (Nginx/Traefik)
4. **Set up backups** for Oracle database volume
5. **Configure resource limits** in docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Oracle XE Docker Image](https://github.com/gvenzl/oci-oracle-xe)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Verify all services are healthy: `docker-compose ps`
3. Ensure Docker Desktop is running
4. Check available resources: `docker stats`

---

**Happy Coding! 🚀**
