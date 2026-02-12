# Ballog - Baseball Intuition Archive Service

A comprehensive service for recording and archiving baseball game attendance experiences.

## Project Structure

This is a monorepo containing:

- **`/backend`**: Spring Boot application (Kotlin) serving the REST API.
- **`/admin-web`**: Next.js (App Router) administration panel for managing data.
- **`init_schema.sql`**: Database schema initialization script for Supabase (PostgreSQL).

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
