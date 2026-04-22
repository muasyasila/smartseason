# 🌾 SmartSeason - Field Monitoring System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> **A complete field management system for agricultural data tracking across Kenya**

## Overview

SmartSeason is a comprehensive web application designed to help agricultural organizations track crop progress across multiple fields during growing seasons. Built specifically for the Kenyan agricultural context, it enables seamless coordination between farm coordinators (Admins) and field agents.

### Problem Solved

Smallholder farmers and agricultural organizations struggle to:
- Track field progress across multiple locations
- Coordinate between coordinators and field agents
- Identify at-risk fields before harvest is compromised
- Maintain accurate records of crop development

### Solution

SmartSeason provides:
- **Role-based access** for admins and field agents
- **Real-time field tracking** with stage progression
- **Smart status detection** (Active, At Risk, Completed)
- **Complete audit trail** of all field updates
- **Beautiful, intuitive dashboard** with analytics

##  Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| **Authentication** | Role-based login (Admin/Agent) | ✅ |
| **Field Management** | Create, edit, delete fields | ✅ |
| **Agent Assignment** | Assign fields to specific agents | ✅ |
| **Stage Updates** | Track progress: Planted → Growing → Ready → Harvested | ✅ |
| **Smart Status** | Auto-calculates Active/At Risk/Completed | ✅ |
| **Activity Logging** | Complete audit trail of all actions | ✅ |
| **CSV Export** | Export activity logs for reporting | ✅ |

### Dashboard Analytics

| Metric | Admin View | Agent View |
|--------|-----------|------------|
| Total Fields | All fields | Assigned fields only |
| Status Distribution | Pie chart | Pie chart |
| Crop Distribution | Bar chart | Bar chart |
| At-Risk Alerts | All fields | Assigned fields only |
| Recent Activity | Full history | Limited view |

### Security Features

- **Row Level Security (RLS)** in PostgreSQL
- **Session-based authentication** with Supabase
- **Role-based access control** (RBAC)
- **Complete audit logging** for compliance

## Tech Stack & Design Decisions

### Why Next.js 15 + TypeScript?

**Decision:** Next.js 15 with App Router and TypeScript

**Reasoning:** 
- Server Components reduce client-side JavaScript bundle size
- Server Actions provide type-safe mutations without API boilerplate
- Built-in caching and revalidation for optimal performance
- TypeScript ensures type safety across the entire application

### Why Supabase?

**Decision:** Supabase (PostgreSQL + Auth)

**Reasoning:**
- Matches the requirement for a relational PostgreSQL database
- Built-in authentication with session management
- Row Level Security (RLS) for data isolation between roles
- Real-time subscriptions ready for future features
- Reduced development time while maintaining full control

### Why Tailwind CSS?

**Decision:** Tailwind CSS for styling

**Reasoning:**
- Utility-first approach enables rapid UI development
- Consistent design system without writing custom CSS
- Built-in responsive design utilities
- Smaller production bundle size

### Database Schema Decisions

**Decision:** Separate tables for fields, profiles, and activity_logs

**Reasoning:**
- Profiles table extends Supabase auth for role management
- Fields table contains all field data with foreign keys to agents
- Activity_logs table provides complete audit trail
- Indexes on frequently queried columns for performance
- RLS policies ensure data isolation between roles

## Status Logic Explanation

Fields are automatically classified into three statuses:

| Status | Condition | Business Logic |
|--------|-----------|----------------|
| **Active** | Stage is 'Planted' or 'Growing' AND within 60 days of planting | Crops developing normally |
| **At Risk** | Stage is 'Planted' or 'Growing' AND exceeds 60 days since planting | Growth delayed, needs attention |
| **Completed** | Stage is 'Ready' or 'Harvested' | Cycle complete |

**Why 60 days?** Based on typical maize growing cycles in Kenya (90-120 days total). The 60-day threshold provides a 30-day warning window before expected harvest, allowing timely intervention.


## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/smartseason.git
cd smartseason
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Set up Supabase**

Create a new Supabase project and run the SQL schema from `database/schema.sql` in the Supabase SQL editor.

**5. Create test users**

In Supabase Dashboard → Authentication → Users:
- Click "Add User"
- Create Admin: `admin@demo.com` / `Admin123!`
- Create Agent: `agent@demo.com` / `Agent123!`

**6. Create profiles for test users**

Run this SQL in Supabase editor:

```sql
INSERT INTO public.profiles (id, email, name, role)
SELECT id, email, 
  CASE WHEN email = 'admin@demo.com' THEN 'Admin User' ELSE 'John Otieno' END,
  CASE WHEN email = 'admin@demo.com' THEN 'admin' ELSE 'agent' END
FROM auth.users
WHERE email IN ('admin@demo.com', 'agent@demo.com');
```

**7. Run the development server**

```bash
npm run dev
```

**8. Open your browser**

```
http://localhost:3000
```

## Demo Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@demo.com | Admin123! | Create fields, view all, assign agents, delete fields |
| **Agent** | agent@demo.com | Agent123! | Update assigned fields, add notes, view own fields |



## Testing the Application

### Manual Test Cases

**1. Authentication**
- Login as admin → See all fields
- Login as agent → See only assigned fields
- Logout → Redirect to login

**2. Field Management (Admin)**
- Create field → Appears in list
- Assign to agent → Agent sees it
- Edit field → Changes saved
- Delete field → Removed from system

**3. Field Updates (Agent)**
- Update stage → Progress bar updates
- Add notes → Saved to history
- Cannot update unassigned fields

**4. Status Logic**
- New field → Active (Planted)
- 60+ days old → At Risk
- Harvested → Completed

**5. Activity Log**
- Actions appear in timeline
- Filters work correctly
- CSV export functions


## Assumptions Made

1. The 60-day threshold for "At Risk" status assumes a standard 90-120 day growing cycle for maize, the most common crop in the assessment region
2. Field stages follow a linear progression (no backward movement)
3. Only admins can create, edit, and delete fields
4. Agents can only update fields assigned to them
5. The system uses Kenyan timezone (EAT) for date calculations

## API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/activities` | GET | Fetch activity logs | Admin only |
| `/api/agents` | GET | List all agents | Admin only |
| `/api/fields/[id]` | GET | Get field details | Yes |
| `/api/health` | GET | Health check | No |


**Live deployment link:** [To Be added]


**Built for Kenyan agriculture**

*Last updated: April 2026*
