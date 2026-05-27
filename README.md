# JobFy

JobFy is a modern full-stack web application featuring a fast React frontend and a robust Node.js backend. The project is designed with scalability and performance in mind, utilizing PostgreSQL for the primary database and Redis for caching and background jobs.

## 🚀 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS & UI Components (Radix UI / shadcn)
- **State Management:** Redux Toolkit & React Query
- **Routing:** React Router v7
- **Real-time:** Socket.io-client
- **Map & Charts:** Leaflet, Recharts

### Backend
- **Environment:** Node.js + Express
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (NeonDB supported for production)
- **Caching & Queuing:** Redis & BullMQ
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **File Storage:** Cloudinary
- **Real-time:** Socket.io

## 🐳 Running with Docker (Recommended)

We provide a complete Docker Compose setup that spins up the Frontend, Backend, PostgreSQL, and Redis containers automatically. This is the easiest way to get the project running locally.

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd jobfy
   ```

2. **Environment Variables:**
   Ensure your `.env` files are correctly configured.
   - Root `.env`: Contains DB credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) used by Docker.
   - `backend/.env`: Contains backend configurations (`JWT_SECRET`, `CLOUDINARY_API_KEY`, etc.).

3. **Start the containers:**
   Run the following command in the root directory:
   ```bash
   docker compose up --build
   ```

4. **Access the Application:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)
   - **Database (PostgreSQL):** `localhost:5432`
   - **Redis:** `localhost:6379`

> **Note:** The backend is configured to wait until the Database and Redis containers are healthy before starting.

## 💻 Manual Setup (Without Docker)

If you prefer to run the project natively on your machine, follow these steps:

### 1. Database & Redis Requirements
You must have **PostgreSQL** and **Redis** running locally or remotely (e.g., NeonDB, Upstash). Update your `backend/.env` with the correct connection strings (`DATABASE_URL` and `REDIS_URL`).

### 2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply database migrations (if any) or sync schema
npx prisma db push

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## 📂 Project Structure

```text
jobfy/
├── backend/          # Node.js Express API
│   ├── prisma/       # Database schemas & migrations
│   ├── src/          # Backend source code (controllers, routes, services)
│   └── Dockerfile    # Backend Docker configuration
├── frontend/         # React application (Vite)
│   ├── src/          # Frontend source code (components, pages, hooks, store)
│   └── Dockerfile    # Frontend Docker configuration
├── docker-compose.yml# Orchestrates all 4 services (FE, BE, DB, Redis)
└── README.md         # Project documentation
```
