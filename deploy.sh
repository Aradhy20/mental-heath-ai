#!/bin/bash

# Mental Health App - Professional Deployment Script
# Deploys frontend to Vercel and backend to Railway

echo "🚀 Starting Professional Deployment..."
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

echo ""
echo -e "${BLUE}📦 Step 1: Building Frontend...${NC}"
cd frontend
npm install
npm run build

echo ""
echo -e "${BLUE}🌐 Step 2: Deploying Frontend to Vercel...${NC}"
vercel --prod

echo ""
echo -e "${BLUE}🔧 Step 3: Deploying Backend Services...${NC}"
cd ../backend

# Login to Railway (if not already logged in)
railway login

# Deploy backend
railway up

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "📊 Next Steps:"
echo "1. Copy your Railway backend URL"
echo "2. Add it to Vercel environment variables as NEXT_PUBLIC_API_URL"
echo "3. Redeploy frontend with: vercel --prod"
echo ""
echo "🎉 Your app is now live!"
