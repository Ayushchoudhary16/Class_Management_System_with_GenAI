# EduCore — Institute Management System Frontend

A production-ready React.js frontend for the Class/Institute Management System backend built with FastAPI.

## 🚀 Tech Stack

- **React 18** + Vite
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **React Router DOM v6** — client-side routing
- **Axios** — API communication
- **Formik + Yup** — form handling & validation
- **Recharts** — data visualization
- **React Toastify** — notifications
- **Context API** — Auth & Theme state

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env if your backend runs on a different port
```

### 3. Start the dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> ⚠️ Make sure your FastAPI backend is running at `http://localhost:8000`

## 🔐 Login Credentials

Use the credentials you registered with. Select the appropriate role (Admin / Student / Faculty) on the login page.

- **Admin login**: POST `/admin/admin_login`
- **Student login**: POST `/student/login`
- **Faculty login**: POST `/faculty/login`

## 📁 Project Structure

```
src/
├── api/              # Axios instances & API service modules
├── components/       # Reusable UI components (Sidebar, Navbar, Table, Modal...)
├── context/          # AuthContext, ThemeContext
├── hooks/            # useFetch, useDisclosure, useDebounce
├── pages/            # All page components organized by module
├── utils/            # Helper functions
├── App.jsx           # Routes configuration
└── main.jsx          # Entry point
```

## 🌙 Features

- Dark / Light mode toggle (persisted in localStorage)
- Collapsible sidebar with icons + labels
- JWT auth with protected routes
- Role-based access (Admin / Student / Faculty)
- Skeleton loaders
- Toast notifications
- Form validation
- Responsive design

## 🏗️ Build for Production

```bash
npm run build
```
