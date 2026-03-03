#!/bin/bash

# Quick Start Script for Business Listing Application
# This script starts all necessary services with proper network configuration

set -e

echo "🚀 Starting Business Listing Application..."

# Ensure the app-network exists
echo "📡 Creating app-network if it doesn't exist..."
docker network create app-network 2>/dev/null || echo "Network app-network already exists"

# Start the backend service first
echo "🔧 Starting Backend API Service..."
cd /home/pecil/business-listing/BusinessListing
docker-compose up -d

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Connect backend to app-network if not already connected
docker network connect app-network think-business-listing-app 2>/dev/null || echo "Backend already on app-network"

# Start the frontend services
echo "🎨 Starting Frontend Services..."
cd /home/pecil/business-listing/business-listing-
docker-compose up -d business-listing think-id

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📊 Service Status:"
docker ps --filter "name=business_listing_app" --filter "name=think_id_app" --filter "name=think-business-listing-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Access URLs:"
echo "  - Business Listing: http://localhost:3010"
echo "  - Think ID: http://localhost:3011"
echo "  - Backend API: http://localhost:8081"
echo ""
echo "📝 View logs:"
echo "  docker logs -f business_listing_app"
echo "  docker logs -f think_id_app"
echo "  docker logs -f think-business-listing-app"
echo ""
echo "🛑 Stop all services:"
echo "  docker-compose down"
echo ""
