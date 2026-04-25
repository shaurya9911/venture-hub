# VentureHub 2.0 🚀
**Where bold ideas meet the right capital**

A full-stack startup financing platform with a dark editorial UI, interactive dashboard, investor profiles, and MongoDB Atlas as the database.

---

## Folder Structure

```
venturehub/
│
├── server.js                 ← Express entry point
├── package.json
├── .env.example              ← Copy to .env with your Atlas URI
├── README.md
│
├── database/                 ← 📦 MongoDB Atlas
│   ├── connection.js         ← Atlas connection + reconnect logic
│   └── seed.js               ← Seed sample data (run once)
│
├── models/                   ← 🗄️ Mongoose schemas
│   ├── Startup.js
│   ├── Investor.js
│   └── Message.js
│
├── routes/                   ← 🌐 Express route handlers
│   ├── startups.js           ← GET/POST/PATCH/DELETE startups
│   └── investors.js          ← Investors + Messages
│
└── public/                   ← 🎨 Frontend (served statically)
    ├── index.html            ← 5 pages: Home, Browse, Submit, Investors, Dashboard
    ├── style.css             ← Dark editorial design system
    └── app.js                ← All UI logic, charts, modal
```

---

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero, live stats, featured startups, sector explorer |
| **Browse** | Filter by sector, sort, search, interactive cards + modal |
| **Submit Idea** | 3-step form with review screen |
| **Investors** | Investor profiles + register as investor |
| **Dashboard** | KPIs, bar chart, donut chart, top startups table |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Connect MongoDB Atlas
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/venturehub?retryWrites=true&w=majority
```

**How to get your Atlas URI:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster**
3. Click **Connect** → **Connect your application**
4. Copy the connection string

### 3. Seed sample data (optional)
```bash
npm run seed
```

### 4. Start the server
```bash
npm start
# or for hot reload:
npm run dev
```

### 5. Open the app
```
http://localhost:3000
```

---

## API Reference

### Startups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/startups` | List all (supports `?sector=`, `?search=`, `?sort=newest\|popular\|funding`) |
| GET | `/api/startups/stats` | Aggregate stats (counts, funding totals, sector breakdown) |
| GET | `/api/startups/:id` | Single startup (increments `views`) |
| POST | `/api/startups` | Create new startup |
| PATCH | `/api/startups/:id/interest` | Increment/decrement interest (`{ action: "add" \| "remove" }`) |
| DELETE | `/api/startups/:id` | Delete startup |

### Investors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/investors` | List all investors |
| POST | `/api/investors` | Register new investor |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send message to founder |
| GET | `/api/messages/:startupId` | Get messages for a startup |

---

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Frontend**: Vanilla JS, CSS custom properties
- **Fonts**: Clash Display + Satoshi
- **Charts**: Canvas API (custom donut + bar charts)
