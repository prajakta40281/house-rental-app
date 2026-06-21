# 🏡 Rentify | Property Rental Platform

A full-stack property rental platform with AI-powered natural language search, built with a focus on type safety and scalable data architecture.

## 🚀 Live Demo
https://house-rental-app-iota.vercel.app/

## 🏗️ Architecture & Engineering

Rentify is built as a decoupled full-stack application with TypeScript across both layers for end-to-end type safety.

### Key Technical Implementations:
- **Vector Search Pipeline**: Uses pgvector on PostgreSQL to enable semantic property search via natural language queries (e.g., "describe your dream home")
- **Type-Safe Data Layer**: Prisma ORM for schema management and type-safe database queries
- **Media Storage**: Cloudinary integration for property image upload and delivery
- **Security**: JWT-based authentication protecting user and property management routes

## 📂 Project Structure

    backend/src/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── prisma/
    │   └── schema.prisma
    ├── utils/
    └── server.ts

    frontend/src/
    ├── components/
    ├── pages/
    ├── App.tsx
    └── main.tsx

## ⚙️ Installation & Setup

### 1. Clone the Repository

    git clone https://github.com/yourusername/Rentify.git
    cd Rentify

### 2. Backend Setup

    cd backend
    npm install

Create a `.env` file:

    PORT=5000
    DATABASE_URL=your_postgres_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_url

Run Prisma migrations:

    npx prisma migrate dev

Run backend:

    npm run dev

### 3. Frontend Setup

    cd frontend
    npm install
    npm run dev

## 🛡️ Security & Optimization
- Environment variables for sensitive credentials
- Type-safe database queries via Prisma
- JWT-protected routes for property management

## 👩‍💻 Author
Prajakta

## 📄 License
This project is licensed under the MIT License.
