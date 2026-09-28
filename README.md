# FinKing Frontend — Next.js 16 & React 19 Financial Operations Dashboard

![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux)
![Alova 3](https://img.shields.io/badge/Alova-3.0-00B4D8?style=for-the-badge)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwind-css)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![next-intl](https://img.shields.io/badge/next--intl-Latest-000000?style=for-the-badge)
![Oxlint + ESLint](https://img.shields.io/badge/Linter-Oxlint_%2B_ESLint-4B32C3?style=for-the-badge)

High-performance, enterprise-grade financial operations dashboard built with **Next.js 16 (Pages Router)**, **React 19**, **Redux Toolkit**, **Alova 3**, **Tailwind CSS v4**, and **next-intl**.

This repository serves as the official frontend application for the [FinKing Financial Operations Engine (FINKING-BACKEND)](https://github.com/swe-rashad/FINKING-BACKEDN).

---

## 🚀 Key Features & Service Integrations

- **📊 Statistics & Analytics Engine**: Real-time KPI summaries (Total Revenue, Transactions Count, Active Users, Avg Amount), monthly revenue charts, and category distribution breakdown. Integrated with `POST /statistics/export` for async BullMQ queue exports.
- **💸 Transaction Management**: Paginated transaction ledger, granular filtering (sender, receiver, merchant, status, type, date range, min/max amount), detailed transaction view, and PDF/CSV export via `POST /transactions/export`.
- **👥 User Administration**: Advanced user directory, role-based controls (Admin, Employee, Customer), status management, profile editing via `PATCH /users/:id`, and user block toggling via `PATCH /users/:id/block`.
- **🏢 Merchant Portal**: Merchant account profile retrieval (`GET /merchants/current`) and profile updating (`PATCH /merchants/current`).
- **🔐 JWT Authentication & Security**: Complete authentication lifecycle with `POST /auth/sign-in`, `POST /auth/sign-up`, `GET /auth/refresh-token` (JTI rotation with Redis blacklisting), and `POST /auth/logout`. Route protection handled via `AuthGuard` & `GuestGuard`.
- **⚡ Dual Mode Runtime (Mock & Live)**: Integrated `@alova/mock` adapter allows instant standalone development without a backend, with seamless runtime toggling to live backend APIs (`NEXT_PUBLIC_API_URL`).

---

## 🏗️ Architecture & Feature-Sliced Design (FSD)

The application follows strict **Feature-Sliced Design (FSD)** principles. `pages/` functions purely as a thin routing layer, while domain-specific logic, UI components, Redux slices, Alova API endpoints, and mock handlers reside isolated inside `features/<domain>`.

```mermaid
flowchart TB
  subgraph pagesLayer ["pages/ — Routing Layer"]
    routes["Thin Page Shells + getStaticProps"]
  end

  subgraph featuresLayer ["features/ — FSD Slices"]
    auth["auth"]
    dashboard["dashboard"]
    statistics["statistics"]
    transactions["transactions"]
    users["users"]
    merchants["merchants"]
  end

  subgraph coreLayer ["core/ — Application Kernel"]
    store["Redux Store"]
    alova["Alova HTTP Client"]
    i18n["i18n Loader"]
    tokens["Token Service"]
  end

  subgraph backendLayer ["NestJS 11 Backend Services (FINKING-BACKEND)"]
    authBE["Auth Module (JWT & JTI Redis)"]
    statsBE["Statistics & BullMQ Export"]
    txBE["Transactions Module"]
    usersBE["Users & Roles Module"]
    merchantsBE["Merchants Module"]
  end

  routes --> featuresLayer
  featuresLayer --> coreLayer
  alova --> backendLayer
```

### 📁 Directory Layout

```
pages/                 Next.js routing surface only (re-exports feature pages)
features/
  auth/                Authentication UI, JWT API, login/register thunks, mocks
  dashboard/           Layout shell, sidebar, header, global nav
  statistics/          KPI metrics, charts, last transactions, export thunk
  transactions/        Paginated table, filter modals, details page, export thunk
  users/               User directory, user modal, block/unblock, edit profile
  merchants/           Merchant profile API & mock handlers
core/
  api/                 Alova instance config, dynamic fetch/mock adapter switcher
  auth/                Token storage, safe redirect utilities
  i18n/                Internationalization message preloading
  store/               Redux Toolkit root store & feature slice registration
shared/
  components/          Atomic UI components (Buttons, Inputs, Modals, Toast)
  guards/              AuthGuard & GuestGuard HOCs
  hooks/               Utility hooks (click-outside, escape key, body lock)
  interceptors/        JWT Bearer header injection & 401 silent token refresh
```

---

## 🔌 API Integration Mapping with FINKING-BACKEND

| Frontend Feature | API Endpoint | HTTP Method | Backend Service |
| --- | --- | --- | --- |
| **Auth** | `/auth/sign-in` | `POST` | AuthController.signIn |
| **Auth** | `/auth/sign-up` | `POST` | AuthController.signUp |
| **Auth** | `/auth/refresh-token` | `GET` | AuthController.refreshToken |
| **Auth** | `/auth/logout` | `POST` | AuthController.logout |
| **Statistics** | `/statistics/revenue-overview` | `GET` | StatisticsController.getRevenueOverview |
| **Statistics** | `/statistics/category-distribution` | `GET` | StatisticsController.getCategoryDistribution |
| **Statistics** | `/statistics/total-revenue` | `GET` | StatisticsController.getTotalRevenue |
| **Statistics** | `/statistics/total-transactions` | `GET` | StatisticsController.getTotalTransactions |
| **Statistics** | `/statistics/avarage-transaction-amount` | `GET` | StatisticsController.getAvarageTransactionAmount |
| **Statistics** | `/statistics/active-users` | `GET` | StatisticsController.getActiveUsers |
| **Statistics** | `/statistics/get-last-transactions` | `GET` | StatisticsController.getLastTransactions |
| **Statistics** | `/statistics/export` | `POST` | StatisticsController.exportStatistics (BullMQ) |
| **Transactions** | `/transactions` | `GET` | TransactionsController.getTransactions |
| **Transactions** | `/transactions/:id` | `GET` | TransactionsController.getTransactionById |
| **Transactions** | `/transactions/export` | `POST` | TransactionsController.exportTransactions (BullMQ) |
| **Users** | `/users` | `GET` | UsersController.getUsers |
| **Users** | `/users/create` | `POST` | UsersController.createUser |
| **Users** | `/users/current` | `GET` | UsersController.getCurrentUser |
| **Users** | `/users/:id` | `GET` | UsersController.getUserById |
| **Users** | `/users/:id` | `PATCH` | UsersController.updateUser |
| **Users** | `/users/:id/block` | `PATCH` | UsersController.blockUser |
| **Merchants** | `/merchants/current` | `GET` | MerchantsController.getCurrentMerchant |
| **Merchants** | `/merchants/current` | `PATCH` | MerchantsController.updateCurrentMerchant |

---

## 🛠️ Technology Stack Detail

- **Next.js 16 (Pages Router)**: Modern React SSR/SSG web framework with fast page loads and localized static prop resolution.
- **React 19**: Concurrent renderer with enhanced hooks.
- **Redux Toolkit**: Predictable global state management for feature domains (`useUsers`, `useTransactions`, `useStatistics`).
- **Alova 3**: Lightweight HTTP request strategy library with built-in mock adapter, request deduplication, and automated token retry interceptors.
- **Tailwind CSS v4**: Utility-first styling engine with customized `@theme` design tokens and responsive glassmorphism themes.
- **next-intl**: Flexible internationalization framework supporting multi-language locale switching.
- **Oxlint & ESLint**: Dual linting pipeline for ultra-fast Rust-powered lint checks and strict code style enforcement.

---

## 💻 Quick Start & Running Locally

### Prerequisites
- Node.js 20+
- pnpm / npm 10+
- Running instance of [FINKING-BACKEND](https://github.com/swe-rashad/FINKING-BACKEDN) (Optional if using Mock Mode)

### 1. Clone & Install
```bash
git clone https://github.com/swe-rashad/FINKING-FRONTEND.git
cd FINKING-FRONTEND
pnpm install
```

### 2. Configure Environment
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_API_URL=http://localhost:8080
```
> Note: Set `NEXT_PUBLIC_ENABLE_MOCKS=true` if running without the NestJS backend.

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| --- | --- | --- |
| `pnpm dev` | `next dev` | Launches local development server |
| `pnpm build` | `next build` | Compiles optimized production bundle |
| `pnpm start` | `next start` | Runs production server |
| `pnpm typecheck` | `tsc --noEmit` | Runs TypeScript static type checking |
| `pnpm lint` | `oxlint && eslint` | Executes full linting suite |
| `pnpm lint:oxlint` | `oxlint` | Fast Oxlint code analysis |
| `pnpm lint:eslint` | `eslint` | ESLint style enforcement |

---

## 🔗 Related Repositories

- ⚙️ **Backend Application**: [swe-rashad/FINKING-BACKEDN](https://github.com/swe-rashad/FINKING-BACKEDN) — NestJS 11, PostgreSQL, TypeORM, BullMQ Queue Engine, Redis Token Rotation, Swagger API Docs.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
