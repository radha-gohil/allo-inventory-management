# Allo Inventory Management System
# Live Demo

[View Live Application](https://allo-inventory-management-na94.vercel.app/)
## Overview

Allo Inventory Management System is a full-stack enterprise-style inventory management application built using Next.js, Supabase, TypeScript, and Tailwind CSS.

The system supports:
- Product management
- Warehouse management
- Real-time inventory tracking
- Reservation lifecycle management
- Warehouse stock transfers
- Audit logging
- Authentication and protected routes
- Real-time synchronization using Supabase Realtime
- Row Level Security (RLS)

This project demonstrates modern full-stack architecture with scalable inventory workflows and enterprise-grade data consistency.

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Frontend + API routes |
| TypeScript | Type safety |
| Tailwind CSS | UI styling |
| Supabase | Database + Auth + Realtime |
| PostgreSQL | Relational database |
| Vercel | Deployment |
| Lucide React | Icons |

---

# Features

## Authentication
- User signup/login
- Protected routes
- Session persistence
- Logout functionality

---

## Product Management
- Add products
- Edit products
- Delete products
- Real-time product updates
- Product inventory tracking

---

## Warehouse Management
- Create warehouses
- Warehouse listing
- Warehouse inventory mapping

---

## Inventory Management
- Product-to-warehouse inventory mapping
- Real-time stock updates
- Reserved stock tracking
- Available stock calculation

Formula:

Available Stock = Total Stock - Reserved Stock

---

## Reservation System
- Reserve inventory stock
- Reservation countdown timer
- Reservation confirmation
- Reservation release
- Automatic expiration cleanup
- Multi-user inventory consistency

---

## Stock Transfers
- Transfer stock between warehouses
- Real-time synchronization
- Inventory consistency validation
- Insufficient stock protection

---

## Audit Logs
- Real-time audit tracking
- Transfer activity logging
- Metadata-based audit records
- Timestamp tracking

---

## Security
- Supabase Row Level Security (RLS)
- Authenticated access policies
- Protected API routes
- Session-based authorization

---

# Database Tables

## products

Stores product information.

| Column | Type |
|---|---|
| id | bigint |
| name | text |
| stock | integer |
| price | numeric |
| sku | text |

---

## warehouses

Stores warehouse data.

| Column | Type |
|---|---|
| id | bigint |
| name | text |
| city | text |

---

## inventory_table

Maps products to warehouses.

| Column | Type |
|---|---|
| id | bigint |
| product_id | bigint |
| warehouse_id | bigint |
| total_stock | integer |
| reserved_stock | integer |

---

## reservations

Stores reservation lifecycle data.

| Column | Type |
|---|---|
| id | bigint |
| inventory_id | bigint |
| reserved_quantity | integer |
| status | text |
| expires_at | timestamptz |

---

## stock_transfers

Tracks warehouse-to-warehouse transfers.

| Column | Type |
|---|---|
| id | bigint |
| product_id | bigint |
| from_warehouse_id | bigint |
| to_warehouse_id | bigint |
| quantity | integer |
| transfer_status | text |

---

## audit_logs

Stores system activity logs.

| Column | Type |
|---|---|
| id | bigint |
| action | text |
| entity | text |
| entity_id | text |
| performed_by | text |
| metadata | jsonb |
| created_at | timestamptz |

---

# Realtime Features

The application uses Supabase Realtime subscriptions for:
- Product updates
- Inventory synchronization
- Reservation synchronization
- Transfer synchronization
- Audit log updates

---

# Reservation Lifecycle

## Reservation States

| Status | Description |
|---|---|
| pending | Reservation created |
| confirmed | Reservation finalized |
| released | Reservation manually released |
| expired | Reservation automatically expired |

---

# Security Architecture

## Row Level Security (RLS)

Authenticated users can:
- Read inventory data
- Create reservations
- Transfer stock
- Access audit logs

Public database access is restricted.

---

# API Routes

| Route | Purpose |
|---|---|
| /api/products | Product CRUD |
| /api/products/[id] | Product update/delete |
| /api/reservations | Create reservations |
| /api/reservations/confirm | Confirm reservation |
| /api/reservations/release | Release reservation |
| /api/reservations/cleanup | Auto-expire reservations |
| /api/warehouses | Warehouse APIs |

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create:

.env.local

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

---

# Run Development Server

```bash
npm run dev
```

---

# Production Deployment

The application is deployed using:
- Vercel
- Supabase Cloud

---

# Key Architectural Highlights

- Full-stack TypeScript architecture
- Real-time synchronization
- Enterprise-style inventory lifecycle
- Reservation concurrency protection
- Protected routes and authenticated access
- Relational database design
- Inventory consistency validation
- Modular component architecture

---

# Future Improvements

- Real role-based access control (RBAC)
- Advanced analytics dashboard
- Email notifications
- Batch inventory operations
- CSV import/export
- Barcode integration
- Multi-organization support

---

# Radha Gohil

Developed as a full-stack inventory management assignment project using Next.js and Supabase.
