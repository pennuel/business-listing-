# Docker Setup Guide

## Overview
This project uses Docker Compose to orchestrate multiple services including Next.js frontends and the Business Listing backend API.

## Network Configuration

All services are connected to the `app-network` bridge network to ensure proper communication between containers.

### DNS Configuration for Node.js Services

The Next.js applications require specific DNS configuration to prevent DNS resolution issues in Docker:

```yaml
dns:
  - 8.8.8.8
  - 8.8.4.4
dns_opt:
  - ndots:0
environment:
  - NODE_OPTIONS=--dns-result-order=ipv4first
```

**Why this is needed:**
- Node.js DNS caching can cause `EAI_AGAIN` errors when resolving container hostnames
- `ndots:0` prevents unnecessary DNS search path attempts
- `--dns-result-order=ipv4first` ensures IPv4 addresses are prioritized

## Service Architecture

### Frontend Services
- **business_listing_app** - Business Listing Dashboard (Port 3010)
- **think_id_app** - Think ID Authentication (Port 3011)

### Backend Services
- **think-business-listing-app** - Business API Server (Port 8081 FastAPI, Port 9082 Spring Boot)
- **postgres_db** - PostgreSQL Database (Port 5432)

### Network Communication
- Frontend apps connect to backend via: `http://think-business-listing-app:8081`
- All services are on the `app-network` Docker bridge network

## Running the Services

### Option 1: Using Root docker-compose.yaml (Recommended)
```bash
cd /home/pecil/business-listing/business-listing-
docker-compose up -d
```

### Option 2: Individual Services
```bash
# Backend API
cd /home/pecil/business-listing/BusinessListing
docker-compose up -d

# Frontend Apps
cd /home/pecil/business-listing/business-listing-/apps/think-id
docker-compose up -d
```

## Troubleshooting DNS Issues

If you encounter DNS resolution errors (`EAI_AGAIN`, `getaddrinfo failed`):

1. **Verify network connectivity:**
   ```bash
   docker network inspect app-network
   ```

2. **Test DNS resolution inside container:**
   ```bash
   docker exec business_listing_app getent hosts think-business-listing-app
   docker exec business_listing_app ping -c 1 think-business-listing-app
   ```

3. **Check backend is reachable:**
   ```bash
   docker exec business_listing_app wget -qO- http://think-business-listing-app:8081/api/BusinessInfo/getBusinessInfos
   ```

4. **Restart frontend container to clear DNS cache:**
   ```bash
   docker restart business_listing_app
   ```

## Environment Variables

### Required for Frontend Apps
- `AUTH_URL` - Frontend URL for NextAuth
- `AUTH_SECRET` - Secret key for NextAuth sessions
- `FUSIONAUTH_CLIENT_ID` - FusionAuth OAuth client ID
- `FUSIONAUTH_CLIENT_SECRET` - FusionAuth OAuth client secret
- `FUSIONAUTH_ISSUER` - FusionAuth server URL
- `BUSINESS_SERVER_API_URL` - Backend API URL (e.g., `http://think-business-listing-app:8081`)
- `DATABASE_URL` - PostgreSQL connection string

### Example .env file
```env
AUTH_URL=https://app.business.think.ke
AUTH_SECRET=your-secret-key-here
FUSIONAUTH_CLIENT_ID=your-client-id
FUSIONAUTH_CLIENT_SECRET=your-client-secret
FUSIONAUTH_ISSUER=https://admin.think.ke:9013
BUSINESS_SERVER_API_URL=http://think-business-listing-app:8081
DATABASE_URL=postgresql://myuser:password@db:5432/think_business_registration?schema=public
AUTH_TRUST_HOST=true
```

## Common Issues and Solutions

### 1. Auth URL Configuration
**Problem:** NextAuth v5 requires exact AUTH_URL configuration
**Solution:** Ensure AUTH_URL in .env matches domain, use AUTH_SECRET (not NEXTAUTH_SECRET)

### 2. DNS Resolution Failures
**Problem:** Node.js fails to resolve container hostnames
**Solution:** Added DNS configuration in docker-compose.yaml (already implemented)

### 3. Network Connectivity
**Problem:** Frontend can't reach backend
**Solution:** Ensure both containers are on `app-network`:
```bash
docker network connect app-network think-business-listing-app
docker network connect app-network business_listing_app
```

### 4. Stale Docker Builds
**Problem:** Code changes not reflected in running container
**Solution:** Rebuild the image:
```bash
docker-compose build business-listing
docker-compose up -d business-listing
```

## Maintenance

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f business_listing_app
docker logs -f think-business-listing-app
```

### Rebuilding After Code Changes
```bash
# Rebuild and restart
docker-compose build
docker-compose down
docker-compose up -d
```

### Cleaning Up
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v
```

## Network Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     app-network                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ business     │  │ think-id     │  │ postgres_db  │  │
│  │ listing      │  │ app          │  │              │  │
│  │ (3010)       │  │ (3011)       │  │ (5432)       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │           │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                           │                             │
│                  ┌────────▼────────┐                    │
│                  │ think-business  │                    │
│                  │ listing-app     │                    │
│                  │ (8081, 9082)    │                    │
│                  └─────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

## Security Notes

- Never commit .env files with real credentials
- Use strong secrets for AUTH_SECRET
- Restrict database access in production
- Use HTTPS in production (configure reverse proxy)
- Keep Docker images updated regularly

## Additional Resources

- [NextAuth v5 Documentation](https://next-auth.js.org/)
- [Docker Networking](https://docs.docker.com/network/)
- [Node.js DNS Resolution](https://nodejs.org/api/dns.html)
