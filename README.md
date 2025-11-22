# AtlasAir Flight Booking System - Backend

A NestJS-based REST API for the AtlasAir flight booking system with Oracle Database integration.

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run the entire application (backend + frontend + database) is using Docker.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- At least 4GB RAM allocated to Docker
- 10GB free disk space

### Running the Application

1. **Clone the repositories:**
   ```bash
   git clone <backend-repo-url>
   git clone <frontend-repo-url>
   ```

2. **Navigate to the backend directory:**
   ```bash
   cd AtlasAir-backend
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Wait for initialization** (first time only, ~2-3 minutes):
   ```bash
   docker-compose logs -f oracle-db
   ```
   Wait until you see: `DATABASE IS READY TO USE!`

5. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000/api/v1
   - **API Documentation**: http://localhost:3000/api/v1/docs (if Swagger is enabled)

### Docker Services

The `docker-compose.yml` orchestrates three services:

| Service | Description | Port |
|---------|-------------|------|
| **oracle-db** | Oracle Database 21c XE | 1521 |
| **backend** | NestJS API with Oracle Instant Client | 3000 |
| **frontend** | React app served with Nginx | 5173 |

### Common Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f oracle-db

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build backend

# Check service status
docker-compose ps

# Stop and remove all data (including database)
docker-compose down -v
```

### Database Access

**Credentials:**
- **Host**: localhost
- **Port**: 1521
- **Service Name**: XEPDB1
- **Username**: `<your-db-username>`
- **Password**: `<your-db-password>`

> ⚠️ **Note**: Configure your credentials in `.env.docker` before running.

**Connect via SQL*Plus:**
```bash
docker-compose exec oracle-db sqlplus <username>/<password>@XEPDB1
```

### Running Database Seeds

```bash
docker-compose exec backend npm run seed
```

---

## 💻 Local Development (Without Docker)

If you prefer to run the backend locally without Docker:

### Prerequisites

- Node.js 18+ installed
- Oracle Database 21c installed and running
- Oracle Instant Client installed

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.docker .env
   # Edit .env with your local database credentials
   ```

3. **Run the development server:**
   ```bash
   npm run start:dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start:prod
   ```

---

## 📁 Project Structure

```
AtlasAir-backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── flights/           # Flight operations
│   ├── reservations/      # Booking system
│   ├── payments/          # Payment processing
│   └── database/          # Database configuration
├── Dockerfile             # Backend Docker image
├── docker-compose.yml     # Multi-service orchestration
├── .dockerignore          # Docker build exclusions
├── .env.docker            # Environment template
├── DOCKER_SETUP.md        # Detailed Docker guide
└── package.json
```

---

## 🔧 Environment Variables

Key environment variables (see `.env.docker` for full list):

```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=oracle-db          # Use 'localhost' for local dev
DB_PORT=1521
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
DB_SERVICE_NAME=XEPDB1

# JWT
JWT_SECRET=<generate-a-secure-random-string>
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

> 💡 **Tip**: Copy `.env.docker` to `.env` and fill in your actual credentials. Never commit `.env` to Git!

---

## 🐛 Troubleshooting

### Docker Issues

**Backend can't connect to database:**
```bash
# Check if Oracle is healthy
docker-compose ps

# Restart backend after DB is ready
docker-compose restart backend
```

**Port already in use:**
```bash
# Stop conflicting services or change ports in docker-compose.yml
ports:
  - "8000:3000"  # Use port 8000 instead
```

**Out of disk space:**
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

### Oracle Database Issues

**Database won't start:**
- Ensure Docker has at least 4GB RAM allocated
- Check logs: `docker-compose logs oracle-db`
- Remove volume and restart: `docker-compose down -v && docker-compose up -d`

---

## 📚 API Documentation

### Main Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/flights` - Search flights
- `POST /api/v1/reservations` - Create booking
- `GET /api/v1/reservations/:id` - Get booking details
- `POST /api/v1/payments` - Process payment

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) or access Swagger UI at http://localhost:3000/api/v1/docs

---

## 🤝 Sharing This Project

To share this project with teammates:

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Add Docker support"
   git push
   ```

2. **They only need to:**
   - Install Docker Desktop
   - Clone the repo
   - Run `docker-compose up -d`
   - Wait 2-3 minutes (first time)
   - Access http://localhost:5173

**No need to install Node.js, Oracle, or configure anything!**

---

## 📖 Additional Documentation

- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Comprehensive Docker guide with troubleshooting
- **[DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)** - Quick reference commands
- **[SETUP.md](./SETUP.md)** - Original setup guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing instructions

---

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: Oracle Database 21c XE
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Email**: Nodemailer
- **Containerization**: Docker & Docker Compose

---

## 📝 Scripts

```bash
npm run start          # Start the application
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode
npm run build          # Build the application
npm run lint           # Lint the code
npm run test           # Run tests
npm run seed           # Seed the database
```

---

## 🔐 Security Notes

**Before sharing or deploying:**

1. Change default passwords in `.env.docker`
2. Use strong JWT secret
3. Enable HTTPS in production
4. Set up proper CORS configuration
5. Never commit `.env` file to Git

---

## 📄 License

UNLICENSED - Private Project

---

## 👥 Contributors

- Your Name - Initial work

---

## 🆘 Need Help?

- Check [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed troubleshooting
- Review logs: `docker-compose logs -f`
- Ensure Docker Desktop is running
- Verify all services are healthy: `docker-compose ps`

---

**Made with ❤️ using NestJS and Docker**
