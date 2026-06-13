# ls-backend
Task by Learnosphere
# Admin Dashboard Technical Assessment

This repository contains a full-stack admin dashboard scaffold for RBAC, permission management, content editing, and activity logging.

## Structure

- `backend/`: Express.js API server with MongoDB and Mongoose.
- `frontend/`: Next.js 15 App Router dashboard with TypeScript and Tailwind CSS.

## Backend

### Run locally

1. Install dependencies:
   - `cd backend`
   - `npm install`
2. Copy `.env.example` to `.env` and configure:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
3. Seed the database with demo users and permissions:
   - `npm run seed`
4. Start the dev server:
   - `npm run dev`

### API overview

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `POST /api/users/:id/reset-password`
- `DELETE /api/users/:id`
- `GET /api/permissions`
- `POST /api/permissions`
- `PUT /api/permissions/:id`
- `POST /api/permissions/assign`
- `POST /api/permissions/remove`
- `GET /api/content/:slug`
- `PUT /api/content/:slug`
- `GET /api/logs/login-history`
- `GET /api/logs/activity`

## Frontend

### Run locally

1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Copy `.env.example` to `.env.local` and configure:
   - `BACKEND_URL=http://localhost:4000`
   - `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`
   - `NEXTAUTH_URL=http://localhost:3000`
   - `NEXTAUTH_SECRET=change_this_secret`
3. Start the frontend:
   - `npm run dev`

### Demo credentials

- Super Admin: `admin@gmail.com` / `Admin123`
- Sub Admin: `subadmin@gmail.com` / `SubAdmin123`

> Note: These are seeded automatically when running `npm run seed` in the backend.

## Key features

- Email/password authentication using backend API and NextAuth credentials provider
- JWT session strategy
- Role verification for `super-admin` and `sub-admin`
- Permission-based modules stored in MongoDB
- Content management pages with dynamic permission checks
- Login history and activity log APIs
- Responsive Tailwind UI with sidebar navigation
- Custom 403/404 experience
- **Form validation with Formik & Yup for all forms**
- **Axios instance with automatic JWT token injection and error handling**
- **React-hot-toast for elegant notifications**
- **API calls directly in page components using axios instance**
- **Catch response helper for centralized error handling**
- **React-secure-storage for sensitive client-side data**

## Frontend architecture

### Libraries & tools

- **Formik + Yup**: Form validation schemas in `lib/validationSchemas.ts`
- **Axios instance**: Configured in `lib/axiosConfig.ts` with automatic JWT injection
- **Error handler**: `lib/catchResponse.ts` for centralized error/toast handling
- **React-hot-toast**: Notifications configured in `components/ToasterProvider.tsx`
- **React-secure-storage**: For secure client-side storage (optional)

### API integration pattern

All page components use a client-side counterpart for data fetching:

- **Pages**: Server-side auth + session verification
- **Client components**: `components/*Client.tsx` for interactive data
  - Direct axios calls (no centralized provider)
  - Automatic token injection via axios interceptors
  - Built-in error handling with `catchResponse()`

### Example: User Management

1. [app/dashboard/users/page.tsx](app/dashboard/users/page.tsx) — Server page
2. [components/UsersClient.tsx](components/UsersClient.tsx) — Client-side logic
3. [components/CreateUserForm.tsx](components/CreateUserForm.tsx) — Formik form
4. [components/UserList.tsx](components/UserList.tsx) — Data display + mutations

## Next steps

- Add database seed scripts for demo users and permissions
- Implement API-driven frontend data tables and forms
- Add refresh token flow and CSRF protections
- Deploy backend to Railway/Render and frontend to Vercel
