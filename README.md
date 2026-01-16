# 🎬 Auto-Poster Social

Автоматическая публикация Reels и Shorts в Instagram, TikTok и YouTube.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **UI** | Tailwind CSS, shadcn/ui |
| **Database** | PostgreSQL + Prisma |
| **Storage** | MinIO (S3-compatible) |
| **Queue** | Redis + BullMQ |
| **Auth** | NextAuth.js |

## 📋 MVP Development Plan

### Phase 1: Foundation
- [x] **Step 1**: Project Scaffolding — Next.js + TypeScript + Tailwind
- [x] **Step 2**: shadcn/ui Setup — UI components library
- [ ] **Step 3**: Docker Infrastructure — PostgreSQL + MinIO + Redis
- [ ] **Step 4**: Database + Prisma — Schema and migrations

### Phase 2: Core Features
- [ ] **Step 5**: Auth (NextAuth.js) — Google OAuth login
- [ ] **Step 6**: Basic Dashboard Layout — Sidebar navigation
- [ ] **Step 7**: MinIO Integration — File upload service
- [ ] **Step 8**: Video Upload UI — Drag & drop, preview
- [ ] **Step 9**: Post CRUD — Create, read, delete posts

### Phase 3: Platform Integration
- [ ] **Step 10**: TikTok OAuth — Connect TikTok account
- [ ] **Step 11**: TikTok Upload — Publish videos to TikTok
- [ ] **Step 11.5**: Instagram OAuth — Connect Instagram Business account
- [ ] **Step 11.6**: Instagram Reels Upload — Publish Reels

### Phase 4: Automation
- [ ] **Step 12**: Job Queue (BullMQ) — Background task processing
- [ ] **Step 13**: Scheduling — Schedule posts for future
- [ ] **Step 14**: Multi-Platform UI — Select multiple platforms
- [ ] **Step 15**: Error Handling & Polish — Toast notifications, retries

## 📁 Project Structure

```
auto-poster-social/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   └── api/               # API routes
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db/                # Prisma client
│   │   ├── platforms/         # TikTok, Instagram, YouTube adapters
│   │   ├── storage/           # MinIO/S3 client
│   │   └── queue/             # BullMQ job handlers
│   └── types/                 # TypeScript types
├── prisma/                    # Database schema
├── docker-compose.yml         # Dev infrastructure
└── .env.local                 # Environment variables
```

## 🐳 Docker Services (Step 3)

```bash
# Start all services
docker compose up -d

# Services:
# - PostgreSQL: localhost:5432
# - MinIO: localhost:9000 (API), localhost:9001 (Console)
# - Redis: localhost:6379
```

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Database
DATABASE_URL="postgresql://..."

# MinIO
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Auth
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Platforms
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
```

## 📝 Future Features (v2+)

- [ ] 💬 Auto-Responder (ManyChat-style)
- [ ] 📝 Threads Generator
- [ ] 🤖 AI Content Generator
- [ ] 📊 Analytics Dashboard

## 📄 License

Private project.
