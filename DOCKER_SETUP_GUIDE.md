# 🧩 Optional Docker Guide - MindfulAI Project

## ✅ What You Have Now

This project is fully runnable without Docker. Docker is only an optional containerized deployment path.

After local setup, everything runs automatically using native services:

```
📦 MongoDB (Atlas or local)
🔙 Express Backend (Port 5003)
🎨 Frontend Next.js (Port 3000)
🤖 Python AI Services:
   - Text Analysis (Port 8002)
   - Voice Analysis (Port 8003)
   - Face Analysis (Port 8004)
   - Fusion Service (Port 8005)
```

---

## 🚀 Optional Docker Quick Start

### 1. Check Docker Installation
```bash
docker --version
docker-compose --version
```

If not installed, Docker is optional; local startup is recommended.

### 2. Build & Start All Services (Optional)
```bash
cd /Users/aradhyjain/Desktop/project
docker-compose up --build
```

### 2. Build & Start All Services
```bash
cd /Users/aradhyjain/Desktop/project
docker-compose up --build
```

### 3. Access the App
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5003/health
MongoDB:   localhost:27017
Redis:     localhost:6379
```

---

## 📋 Useful Docker Commands

### View running services
```bash
docker-compose ps
```

### View logs for specific service
```bash
docker-compose logs express_backend
docker-compose logs frontend
```

### Stop all services
```bash
docker-compose down
```

### Remove all data (fresh start)
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose build express_backend
docker-compose up -d express_backend
```

### Access MongoDB inside Docker
```bash
docker exec -it mental_health_mongodb mongosh -u admin -p admin123
```

---

## 🔧 Troubleshooting

### Port already in use?
```bash
# Kill process on port
lsof -i :3000             # Find process
kill -9 <PID>             # Kill it

# Or use different port
docker-compose.yml - change ports section
```

### Container won't start?
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild and restart
docker-compose down
docker-compose up --build
```

### MongoDB connection issues?
```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

---

## 📊 Docker Compose File Structure

### Services Include:
- **mongodb** - Document database
- **redis** - Cache & session store
- **express_backend** - Main API server
- **text_service** - Text emotion analysis
- **voice_service** - Voice analysis
- **face_service** - Face recognition
- **fusion_service** - Multi-modal fusion
- **frontend** - Next.js web app

### Networks:
- All services communicate via `mental_health` bridge network
- Isolated from external system

### Volumes:
- **mongodb_data** - Persistent MongoDB storage
- **redis_data** - Redis persistence

---

## 🎯 Environment Variables

All configured in `docker-compose.yml`:

```yaml
MONGODB_URI: mongodb://admin:admin123@mongodb:27017/mental_health_db
REDIS_URL: redis://redis:6379
JWT_SECRET: mindful_ai_secret_key_2025_production
NODE_ENV: production
```

Change these in `.env` or docker-compose.yml if needed.

---

## 📈 Monitoring

### Check service health
```bash
curl http://localhost:5003/health
# Should return: { "status": "OK", "database": "Connected" }
```

### View all container processes
```bash
docker ps -a
docker stats
```

### Check network connectivity
```bash
docker-compose exec express_backend curl http://mongodb:27017
```

---

## 🎓 Docker Learning Resources

- What it does: Containerizes entire app - all dependencies bundled
- Why: Works on any machine (Windows, Mac, Linux)
- How: All services defined in docker-compose.yml

For more: https://docs.docker.com/compose/

---

## ✨ Next Steps

1. Install Docker Desktop
2. Run: `docker-compose up --build`
3. Visit: http://localhost:3000
4. Create account & test features
5. Check logs: `docker-compose logs -f`

🎉 Full app running!
