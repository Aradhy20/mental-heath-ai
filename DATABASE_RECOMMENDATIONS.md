# Recommended Database Solutions for MindfulAI Project

## Quick Decision Matrix

| Component | Recommended | Reason |
|-----------|-------------|--------|
| **Main Data Store** | MongoDB Atlas | Already architected for, supports geospatial queries |
| **Caching/Sessions** | Redis | Fast, session management, real-time features |
| **Vector/ML Data** | ChromaDB | AI embeddings storage for RAG |
| **File Storage** | AWS S3 / Firebase Storage | Journal exports, user files |
| **Real-time** | Firebase Realtime DB | Real-time notifications, chat |

---

## 1. **PRIMARY DATABASE: MongoDB Atlas** ⭐ RECOMMENDED

### Why MongoDB?
✅ **Already configured** in your Express backend  
✅ **Geospatial indexing** for doctor location finder (2dsphere)  
✅ **Flexible schema** for mood tracking variations  
✅ **Free tier available** (M0 cluster)  
✅ **Easy cloud deployment** (works with Render, Railway)  

### Setup (5 minutes)
```bash
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with Google/GitHub (FREE)
3. Create M0 cluster (FREE TIER)
4. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/db
5. Update root .env: MONGO_DETAILS=mongodb+srv://...
   Or update `backend/express/.env`: MONGODB_URI=mongodb+srv://...
6. Add your IP to whitelist (or allow all for dev)
```

### Collections You Need
```
- users (authentication, profiles)
- moods (mood entries with timestamps)
- journals (journal entries, sentiment)
- doctors (with geolocation: {type: "Point", coordinates: [lon, lat]})
- chats (conversation history)
- notifications (email/SMS queue)
- analysis (AI analysis results, embeddings)
```

### Geospatial Index Example
```javascript
// Already in your code - just ensure indexing
db.doctors.createIndex({ "location": "2dsphere" })
```

---

## 2. **SECONDARY: Redis** (For Performance) 🚀

### Why Redis?
✅ **Session storage** (JWT tokens, user sessions)  
✅ **Cache layer** (API responses, mood stats)  
✅ **Real-time features** (Socket.io integration)  
✅ **Rate limiting** (already in your code)  

### Quick Setup
```bash
# Option A: Redis Cloud (Recommended for production)
# Go to: https://redis.com/try-free/

# Option B: Local development
brew install redis
redis-server
```

> Optional: Redis can also run via Docker, but local Redis is sufficient for this project.

### Usage in Your App
```javascript
// Session storage
session: {
  store: new RedisStore(),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}

// Cache mood calculations
redis.set(`mood_stats_${userId}`, JSON.stringify(stats), 'EX', 3600)
```

---

## 3. **AI/ML: ChromaDB** (Vector Database) 🤖

### Why ChromaDB?
✅ **Store AI embeddings** from emotion analysis  
✅ **Semantic search** for similar mood patterns  
✅ **RAG (Retrieval Augmented Generation)** for better responses  
✅ **Lightweight, open-source**  

### Connection Example
```python
# In your Python FastAPI services
import chromadb

chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(
    name="mood_embeddings",
    metadata={"hnsw:space": "cosine"}
)

# Store emotion embeddings
collection.add(
    ids=[str(mood_id)],
    embeddings=[embedding_vector],
    documents=[mood_text],
    metadatas=[{"user_id": user_id, "emotion": "joy"}]
)
```

---

## 4. **File Storage: Firebase Storage or AWS S3** 📁

### Why?
✅ Journal exports (PDF, markdown)  
✅ Voice/audio files from voice analysis  
✅ User profile pictures  
✅ Daily check-in reports  

### Recommendation
**Firebase Storage** (cheaper, simpler)
```bash
# Install
npm install firebase-admin

# Use in Express
const bucket = admin.storage().bucket();
await bucket.file(`journals/${userId}/${filename}`).save(data);
```

---

## 5. **CONSIDERATION: PostgreSQL Alternative** (If Migrating)

If you want to migrate away from MongoDB later:

| Feature | MongoDB | PostgreSQL |
|---------|---------|-----------|
| Geospatial | ✅ Native 2dsphere | ✅ PostGIS extension |
| Schema Flexibility | ✅ Flexible | ⚠️ Strict |
| Real-time | ⚠️ Polling | ⚠️ Polling (use Redis) |
| Cost (Free Tier) | ✅ M0 free | ⚠️ Limited free tiers |
| Scalability | ✅ Easy sharding | ⚠️ More complex |

**Recommendation**: Stick with **MongoDB Atlas** for your use case.

---

## 📋 SETUP CHECKLIST FOR TODAY

### Priority 1: MongoDB Atlas (Do This Now)
- [ ] Create MongoDB Atlas account (free M0 tier)
- [ ] Create cluster
- [ ] Add IP to whitelist
- [ ] Get connection string
- [ ] Update `.env` file
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mental_health_db?retryWrites=true&w=majority
  ```
- [ ] Test connection with Express backend

### Priority 2: Redis (Optional but Recommended)
- [ ] Use Redis Cloud free tier OR
- [ ] Install local Redis for development
- [ ] Configure session store

### Priority 3: ChromaDB (For AI Features)
- [ ] Already partially done (install chromadb)
- [ ] Connect to Python FastAPI services
- [ ] Test embeddings storage

---

## 🚀 QUICK START: MongoDB Atlas Setup

```bash
# 1. After getting connection string, update .env
MONGODB_URI=mongodb+srv://user:password@cluster0.abc123.mongodb.net/mental_health_db

# 2. Restart Express backend
cd /Users/aradhyjain/Desktop/project/backend/express
PORT=5003 MONGODB_URI="your-connection-string" npm start

# 3. Test connection
curl http://localhost:5003/health
# Should show: "database": "Connected"
```

---

## 💡 My Recommendation: Hybrid Approach

```
┌─────────────────────────────────────┐
│       Frontend (Next.js)            │
│       Port 3000                     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
  REST/GraphQL      Real-time
       │             (Socket.io)
       │                │
┌──────▼─────────┐  ┌──▼──────────┐
│ Express Backend│  │ Redis Store │
│ Port 5003      │  │ Sessions    │
└──────┬─────────┘  └─────────────┘
       │
       ├─────────────────────────┐
       │                         │
┌──────▼──────────┐    ┌────────▼────────┐
│ MongoDB Atlas   │    │ Python FastAPI  │
│ (Main Data)     │    │ (AI Services)   │
└─────────────────┘    │ 

**This architecture provides:**
- ✅ Persistence (MongoDB)
- ✅ Performance (Redis cache)
- ✅ Real-time (Socket.io + Redis)
- ✅ AI capabilities (ChromaDB)
- ✅ Scalability
- ✅ Easy cloud deployment

---

## ⚠️ Current Issue: No Local MongoDB

**Solution**: Use **MongoDB Atlas** (cloud) instead of local installation:
- **Free tier**: 512MB storage, perfect for development
- **No installation needed**: Just connection string
- **Same API**: Drop-in replacement in your Express backend

Would you like me to guide you through **MongoDB Atlas setup** right now?
