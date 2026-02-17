# Project Structure Documentation

## Overview

This document explains the directory structure and organization of the Multimodal AI Mental Health Detection System.

## Directory Structure

```
aradhy/
├── backend/                    # Backend microservices
│   ├── auth_service/          # Authentication service
│   ├── text_service/          # Text emotion analysis service
│   ├── voice_service/         # Voice stress detection service
│   ├── face_service/          # Facial emotion recognition service
│   ├── fusion_service/        # Multimodal fusion service
│   ├── doctor_service/        # Doctor recommendation service
│   ├── notification_service/  # Notification service
│   └── report_service/        # Reporting service
├── frontend/                  # Next.js frontend application
├── ai_models/                 # AI/ML models storage
├── data/                      # Dataset (Roboflow format)
├── docker/                    # Docker configurations
├── docs/                      # Documentation
├── .gitignore                 # Git ignore file
├── docker-compose.yml         # Main Docker Compose file
├── requirements.txt           # Python dependencies
└── README.md                  # Main project README
```

## Backend Services

Each backend service is a独立的 FastAPI application with its own:

- `main.py` - Entry point
- `models.py` - Database models
- `schemas.py` - Pydantic schemas
- `routers/` - API route handlers
- `services/` - Business logic
- `utils/` - Utility functions
- `Dockerfile` - Container configuration
- `.env` - Environment variables

### Service Descriptions

1. **auth_service**: Handles user registration, login, JWT token generation and validation
2. **text_service**: Processes text input and performs emotion analysis using NLP models
3. **voice_service**: Analyzes voice recordings for stress detection
4. **face_service**: Performs facial emotion recognition using computer vision
5. **fusion_service**: Combines results from all modalities using weighted algorithms
6. **doctor_service**: Provides doctor recommendations based on location and specialty
7. **notification_service**: Manages email/SMS notifications
8. **report_service**: Generates PDF reports of analysis results

## Frontend

The frontend is a Next.js 15 application with:

- `pages/` - Page components
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `styles/` - CSS/Tailwind styles
- `public/` - Static assets
- `store/` - State management (Zustand)

## AI Models

The `ai_models/` directory contains:

- Pre-trained models for each modality
- Model loading scripts
- Preprocessing utilities
- Post-processing functions

## Data

The `data/` directory contains the Roboflow dataset with:

- `train/` - Training images and labels
- `valid/` - Validation images and labels
- `test/` - Test images and labels
- `data.yaml` - Dataset configuration

## Docker

The `docker/` directory contains:

- `init.sql` - Database initialization script
- Service-specific Docker configurations

## Deployment

The application is deployed using Docker Compose with:

- PostgreSQL database
- Redis for caching
- Individual containers for each microservice
- Nginx reverse proxy (in production)