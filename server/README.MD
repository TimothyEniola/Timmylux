# TIMMYLUX Backend API

Complete backend system for TIMMYLUX e-commerce platform.

## Features

- 🔐 JWT Authentication with HttpOnly cookies
- 👥 Role-Based Access Control (RBAC)
- 📦 Product Management with Variations
- 🛒 Shopping Cart & Wishlist
- 📝 Order Management
- 💳 Paystack Payment Integration
- 📧 Email Notifications (Nodemailer)
- ☁️ Cloudinary Image Upload
- 🎟️ Coupon System
- 🎉 Event Management
- 🎓 Academy Applications
- 📊 Admin Analytics Dashboard
- ⏰ Automated Background Jobs

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT (HttpOnly cookies)
- **File Upload:** Cloudinary + Multer
- **Payments:** Paystack
- **Email:** Nodemailer
- **Scheduling:** Node-cron

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Cloudinary Account
- Paystack Account
- SMTP Email Service

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd timmylux-backend
```

## Install dependencies
```Bash
npm install
Set up environment variables
```

cp .env.example .env
# Edit .env with your actual credentials
Set up database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed
```

## Start development server


```bash
npm run dev
```
The server will start at http://localhost:5000

## Database Setup
Create PostgreSQL Database

```bash
### Using psql
createdb timmylux

### Or using SQL
CREATE DATABASE timmylux;
```

## Run Migrations

```bash
npx prisma migrate dev --name init
```

## Seed Database

```bash
npm run seed
```
Default credentials after seeding:

Super Admin: superadmin@timmylux.com / SuperAdmin@123
Admin: admin@timmylux.com / Admin@123
Customer: customer@example.com / Customer@123