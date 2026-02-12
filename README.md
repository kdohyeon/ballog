# Ballog - Baseball Intuition Archive Service

A comprehensive service for recording and archiving baseball game attendance experiences.

## Project Structure

This is a monorepo containing:

```
.
├── admin-web/          # Admin Panel (Next.js 14, Ant Design, Tailwind CSS)
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── app/        # App Router pages and layouts
│   │   ├── lib/        # Shared libraries (Supabase, API clients, Registry)
│   │   ├── types/      # TypeScript type definitions
│   │   └── ...
│   ├── next.config.js  # Next.js configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── ...
├── backend/            # Backend API (Spring Boot 3.2, Kotlin)
│   ├── src/
│   │   └── main/
│   │       ├── kotlin/com/ballog/backend/
│   │       │   ├── config/      # Configuration classes
│   │       │   ├── controller/  # REST Controllers
│   │       │   ├── dto/         # Data Transfer Objects
│   │       │   ├── entity/      # JPA Entities
│   │       │   ├── repository/  # Data Repositories
│   │       │   └── service/     # Business Logic
│   │       └── resources/       # Application properties
│   ├── build.gradle.kts # Gradle build script
│   └── ...
├── init_schema.sql     # Database initialization script
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- JDK 17+
- Node.js 18+ (LTS)
- Docker (optional, for local DB)
- Supabase Project (PostgreSQL)

### Backend Setup

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   ./gradlew build
   # On Windows: gradelew.bat build
   ```
3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

### Admin Web Setup

1. Navigate to `admin-web`:
   ```bash
   cd admin-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Connect to your Supabase PostgreSQL database.
2. Run the contents of `init_schema.sql` in the SQL Editor.

## Tech Stack

- **Backend**: Kotlin, Spring Boot 3.2, JPA, Validation
- **Frontend**: Next.js 14, TypeScript, Ant Design, Tailwind CSS, React Query
- **Database**: PostgreSQL (Supabase)
