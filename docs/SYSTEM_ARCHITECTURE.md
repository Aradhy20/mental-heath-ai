# Multimodal Mental Health Detection System - System Architecture

## Overview

This document provides a comprehensive overview of the Multimodal Mental Health Detection System architecture, including all components, services, and their interactions.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (Next.js)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Web Interface (React/Next.js)                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   Login     │  │ Dashboard   │  │ AI Chat     │  │ Monitoring  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │Assessment   │  │ Reports     │  │ Doctors     │  │ Settings    │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │   REST API      │ │   WebSocket     │ │   WebRTC        │
        │   Gateway       │ │   Connection    │ │   Connection    │
        └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND SERVICES                                  │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Auth        │  │ Text        │  │ Voice       │  │ Face        │       │
│  │ Service     │  │ Analysis    │  │ Analysis    │  │ Analysis    │       │
│  │ (FastAPI)   │  │ Service     │  │ Service     │  │ Service     │       │
│  │ Port: 8001  │  │ (FastAPI)   │  │ (FastAPI)   │  │ (FastAPI)   │       │
│  │             │  │ Port: 8002  │  │ Port: 8003  │  │ Port: 8004  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│        │                 │                 │                 │            │
│        ▼                 ▼                 ▼                 ▼            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │             │  │             │  │             │  │             │       │
│  │  JWT Auth   │  │ NLP Models  │  │ Audio Proc. │  │ CV Models   │       │
│  │             │  │             │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│        │                 │                 │                 │            │
│        └─────────────────┼─────────────────┼─────────────────┘            │
│                          ▼                 ▼                              │
│                    ┌─────────────┐  ┌─────────────┐                       │
│                    │ Fusion      │  │ Doctor      │                       │
│                    │ Service     │  │ Service     │                       │
│                    │ (FastAPI)   │  │ (FastAPI)   │                       │
│                    │ Port: 8005  │  │ Port: 8006  │                       │
│                    └─────────────┘  └─────────────┘                       │
│                          │                 │                              │
│                          ▼                 ▼                              │
│                    ┌─────────────┐  ┌─────────────┐                       │
│                    │ Notification│  │ Report      │                       │
│                    │ Service     │  │ Service     │                       │
│                    │ (FastAPI)   │  │ (FastAPI)   │                       │
│                    │ Port: 8007  │  │ Port: 8008  │                       │
│                    └─────────────┘  └─────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌─────────────────────┐
                        │    PostgreSQL       │
                        │   Database          │
                        │   Port: 5432        │
                        └─────────────────────┘
                                    │
                                    ▼
                        ┌─────────────────────┐
                        │      Redis          │
                        │   Cache/Session     │
                        │   Port: 6379        │
                        └─────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: ShadCN UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time Communication**: WebRTC, WebSocket
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Containerization**: Docker
- **Orchestration**: Docker Compose

### AI/ML Components
- **Text Analysis**: Transformers (BERT/RoBERTa)
- **Voice Analysis**: Librosa + PyTorch
- **Face Analysis**: OpenCV + PyTorch
- **Fusion Engine**: Custom weighted algorithm

### Infrastructure
- **Deployment**: Docker containers
- **Reverse Proxy**: Nginx (in production)
- **Monitoring**: Prometheus + Grafana (planned)
- **Logging**: ELK Stack (planned)

## Service Architecture

### 1. Authentication Service (Port: 8001)
**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password management
- User profile management

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /users/me` - Get current user
- `PUT /users/me` - Update user profile
- `DELETE /users/me` - Delete user account

### 2. Text Analysis Service (Port: 8002)
**Responsibilities:**
- Text emotion analysis using NLP
- Processing user text input
- Storing analysis results

**Endpoints:**
- `POST /analyze/text` - Analyze text for emotions
- `GET /analyze/text/{text_id}` - Get specific analysis

### 3. Voice Analysis Service (Port: 8003)
**Responsibilities:**
- Voice stress detection
- Audio feature extraction
- Processing voice recordings

**Endpoints:**
- `POST /analyze/voice` - Analyze voice for stress
- `GET /analyze/voice/{voice_id}` - Get specific analysis

### 4. Face Analysis Service (Port: 8004)
**Responsibilities:**
- Facial emotion recognition
- Image processing
- Face detection and analysis

**Endpoints:**
- `POST /analyze/face` - Analyze face for emotions
- `GET /analyze/face/{face_id}` - Get specific analysis

### 5. Fusion Service (Port: 8005)
**Responsibilities:**
- Combining results from all modalities
- Calculating final risk assessment
- Generating comprehensive results

**Endpoints:**
- `POST /fusion` - Combine analysis results
- `GET /fusion/{result_id}` - Get specific fusion result

### 6. Doctor Service (Port: 8006)
**Responsibilities:**
- Doctor database management
- Location-based doctor recommendations
- Geospatial queries

**Endpoints:**
- `GET /doctor/nearby` - Find nearby doctors
- `GET /doctor/specialists` - Find specialists
- `POST /doctor` - Add new doctor
- `PUT /doctor/{doctor_id}` - Update doctor
- `DELETE /doctor/{doctor_id}` - Remove doctor

### 7. Notification Service (Port: 8007)
**Responsibilities:**
- Sending notifications via multiple channels
- Managing notification preferences
- Tracking notification status

**Endpoints:**
- `POST /notifications/send` - Send notification
- `GET /notifications/user/{user_id}` - Get user notifications
- `PUT /notifications/{notif_id}` - Update notification
- `DELETE /notifications/{notif_id}` - Delete notification

### 8. Report Service (Port: 8008)
**Responsibilities:**
- Generating detailed analysis reports
- Creating PDF documents
- Storing report metadata

**Endpoints:**
- `POST /reports/generate` - Generate new report
- `GET /reports/all` - Get all reports
- `GET /reports/user/{user_id}` - Get user reports
- `GET /reports/{report_id}/pdf` - Get PDF report

## Data Flow

1. **User Authentication**
   - User registers/logs in through frontend
   - Auth service validates credentials
   - JWT token is generated and returned
   - Frontend stores token for subsequent requests

2. **Data Collection**
   - User interacts with AI chat interface
   - Text input is sent to Text Analysis Service
   - Voice recording is sent to Voice Analysis Service
   - Camera feed is sent to Face Analysis Service

3. **Analysis Processing**
   - Each service processes its respective data
   - AI models generate scores and labels
   - Results are stored in database
   - Services return analysis results

4. **Result Fusion**
   - Fusion service collects results from all analysis services
   - Weighted algorithm combines scores
   - Final risk assessment is calculated
   - Comprehensive result is stored

5. **Action Generation**
   - Based on risk level, appropriate actions are triggered
   - High-risk users trigger notifications
   - Reports are generated for all users
   - Doctor recommendations are provided if needed

6. **User Feedback**
   - Results are displayed in frontend dashboard
   - Users can view detailed reports
   - Users can contact recommended doctors
   - Users receive notifications and alerts

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### Text Analysis Table
```sql
CREATE TABLE text_analysis (
    text_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    input_text TEXT,
    emotion_label VARCHAR(50),
    emotion_score DECIMAL(5,4),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Voice Analysis Table
```sql
CREATE TABLE voice_analysis (
    voice_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    voice_score DECIMAL(5,4),
    voice_label VARCHAR(50),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Face Analysis Table
```sql
CREATE TABLE face_analysis (
    face_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    face_score DECIMAL(5,4),
    emotion_label VARCHAR(50),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Results Table
```sql
CREATE TABLE results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    final_score DECIMAL(5,4),
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2),
    contact VARCHAR(20)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    notif_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'unread'
);
```

## Security Considerations

### Data Protection
- All sensitive data is encrypted at rest
- Communication between services uses HTTPS
- Database connections are secured
- Access tokens have short expiration times

### Authentication
- JWT tokens for stateless authentication
- Passwords hashed with bcrypt
- Role-based access control
- Rate limiting to prevent abuse

### Privacy
- User consent required for data collection
- Data anonymization where possible
- GDPR compliance measures
- Secure data deletion procedures

### Network Security
- Docker network isolation
- Firewall rules for service ports
- Regular security updates
- Intrusion detection systems (planned)

## Deployment Architecture

### Development Environment
- Docker Compose for local development
- Shared volumes for code hot-reloading
- Environment-specific configuration files
- Debugging tools enabled

### Production Environment
- Kubernetes for container orchestration
- Load balancers for high availability
- Auto-scaling based on demand
- Monitoring and alerting systems
- Backup and disaster recovery

### CI/CD Pipeline
- GitHub Actions for automated testing
- Docker image building and pushing
- Automated deployment to staging
- Manual approval for production deployment

## Performance Considerations

### Scalability
- Microservices architecture for independent scaling
- Database connection pooling
- Caching with Redis for frequently accessed data
- Asynchronous processing for heavy computations

### Optimization
- Database indexing for faster queries
- CDN for static assets
- Image compression for face analysis
- Audio compression for voice analysis

### Monitoring
- Service health checks
- Performance metrics collection
- Error rate tracking
- User experience monitoring

## Future Enhancements

### AI Improvements
- Continuous model retraining
- Active learning implementation
- Ensemble methods for better accuracy
- Explainable AI for result interpretation

### Feature Extensions
- Mobile application development
- Integration with wearable devices
- Crisis detection and intervention
- Personalized treatment recommendations

### Infrastructure Upgrades
- Serverless functions for event processing
- Edge computing for real-time analysis
- Multi-region deployment for global users
- Advanced analytics and reporting

## Maintenance

### Regular Tasks
- Database backups and maintenance
- Security patch updates
- Performance monitoring and optimization
- User feedback analysis and feature prioritization

### Troubleshooting
- Centralized logging system
- Error tracking and alerting
- Performance profiling tools
- Incident response procedures

This architecture provides a solid foundation for a comprehensive mental health detection system that can scale and evolve with user needs while maintaining security and privacy standards.