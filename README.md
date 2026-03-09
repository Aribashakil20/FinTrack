# FinTrack – Personal Finance Tracker

> A mobile-first full-stack finance tracker for students, families, and individuals.
> Track income, expenses, set category budgets, and get smart insights.

---

## Screenshots (Pages)

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT sign-in |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Balance banner, charts, insights |
| Add Transaction | `/transactions/add` | Category grid, custom category |
| Transactions | `/transactions` | Full history with search & filter |
| Budget | `/budget` | Monthly budget bars + alerts |
| Profile | `/profile` | User info + logout |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Chart.js |
| Backend | Java 17, Spring Boot 3, Spring Data JPA, Spring Security |
| Auth | JWT tokens, BCrypt password hashing |
| Database | MySQL 8 |
| Build | Maven (backend), npm (frontend) |
| Deploy | Docker + docker-compose |

---

## Features

### Authentication
- Register / Login with JWT
- Passwords hashed with BCrypt
- Protected routes — each user sees only their own data

### Transaction Management
- Add income or expense
- 12 default categories with emoji icons
- Custom category support
- Edit and delete with confirmation
- Search and filter by type

### Dashboard (Mobile First)
- Balance banner showing total balance
- Monthly income / expense / savings stat cards
- Personalized greeting ("Good morning, Ariba 👋")
- **Doughnut chart** — expense breakdown by category
- **Bar chart** — 12-month income vs expense comparison
- Recent 5 transactions at a glance

### Budget Tracking
- Set monthly spending limits per category
- Visual progress bars (green → amber → red)
- Alerts when budget is exceeded
- "Over by ₹X" warning message

### Smart Insights
- Savings rate calculated automatically
- Highlights highest spending category
- Food spending percentage alert
- Tips to improve savings

### Mobile UI
- Bottom navigation bar (Home, History, Add, Budget, Profile)
- Large tap targets, clean card layout
- Works great on phones and desktops

---

## Project Structure

```
MoneyMate/
├── docker-compose.yml              # Full stack with MySQL
├── .env.example                    # Environment variable template
│
├── fintrack-backend/               # Spring Boot API
│   ├── Dockerfile
│   └── src/main/java/com/fintrack/
│       ├── controller/             # AuthController, TransactionController,
│       │                           # BudgetController, DashboardController
│       ├── service/                # AuthService, TransactionService,
│       │                           # BudgetService, DashboardService
│       ├── repository/             # JPA repositories
│       ├── model/                  # User, Transaction, Budget
│       ├── dto/                    # Request/Response DTOs
│       └── security/               # JWT filter, SecurityConfig
│
└── fintrack-nextjs/                # Next.js 14 App Router frontend
    ├── Dockerfile
    ├── app/
    │   ├── (auth)/login/           # Login page
    │   ├── (auth)/register/        # Register page
    │   └── (app)/                  # Protected layout with BottomNav
    │       ├── dashboard/          # Dashboard page
    │       ├── transactions/       # Transaction history
    │       ├── transactions/add/   # Add / Edit transaction
    │       ├── budget/             # Budget management
    │       └── profile/            # User profile
    ├── components/                 # BottomNav, StatCard, Charts, BudgetBar
    ├── context/                    # AuthContext (JWT state)
    └── lib/                        # Axios API client
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login`    | No | Login, receive JWT |

### Transactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/api/transactions`       | Yes | Get all transactions |
| POST   | `/api/transactions`       | Yes | Create transaction |
| PUT    | `/api/transactions/{id}`  | Yes | Update transaction |
| DELETE | `/api/transactions/{id}`  | Yes | Delete transaction |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/summary` | Yes | Monthly stats, charts, insights |

### Budgets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/api/budgets`       | Yes | Get budgets (month/year) |
| POST   | `/api/budgets`       | Yes | Create or update budget |
| DELETE | `/api/budgets/{id}`  | Yes | Delete budget |

---

## How to Run Locally

### Prerequisites
- Java 17+, Maven 3.6+
- MySQL 8+
- Node.js 18+

### 1 — Configure database password

Edit `fintrack-backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=your_mysql_password
```

### 2 — Start the backend

```bash
cd fintrack-backend
mvn spring-boot:run

# Windows (if mvn not in PATH):
& "C:\Program Files\apache-maven-3.9.13\bin\mvn.cmd" spring-boot:run
```
Backend: `http://localhost:8080`

### 3 — Start the Next.js frontend

```bash
cd fintrack-nextjs
npm install
npm run dev
```
Frontend: `http://localhost:3000`

---

## Docker Deployment

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your values
# (set a strong JWT_SECRET for production)

# 3. Build and start everything
docker-compose up --build

# App runs at http://localhost:3000
```

To stop:
```bash
docker-compose down
```

To stop and delete all data:
```bash
docker-compose down -v
```

---

## Deploy to Railway / Render

### Backend (Render)
1. Create a new **Web Service** → connect your GitHub repo
2. Set root directory: `fintrack-backend`
3. Build command: `mvn package -DskipTests`
4. Start command: `java -jar target/*.jar`
5. Add environment variables: `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`

### Frontend (Vercel — recommended for Next.js)
1. Import project on vercel.com
2. Set root directory: `fintrack-nextjs`
3. Add env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

---

## Database Schema

```sql
CREATE TABLE users (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME
);

CREATE TABLE transactions (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id),
  type       ENUM('INCOME','EXPENSE') NOT NULL,
  category   VARCHAR(100) NOT NULL,
  amount     DECIMAL(15,2) NOT NULL,
  note       VARCHAR(500),
  date       DATE NOT NULL,
  created_at DATETIME
);

CREATE TABLE budgets (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id),
  category     VARCHAR(100) NOT NULL,
  limit_amount DECIMAL(15,2) NOT NULL,
  month        INT NOT NULL,
  year         INT NOT NULL,
  UNIQUE (user_id, category, month, year)
);
```
