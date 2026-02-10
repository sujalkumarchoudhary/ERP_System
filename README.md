# ERP System Project

A comprehensive, full-stack Enterprise Resource Planning (ERP) system designed to streamline business operations including Employee Management, Inventory Tracking, Sales Monitoring, Leave & Attendance Management, and Task Assignments. Built with the MERN stack (MongoDB, Express, React, Node.js) for scalability and performance.

## 🚀 Features

### **Admin Module**
- **Dashboard**: Real-time overview of key metrics (Total Employees, Leave Requests, Low Stock, etc.).
- **Employee Management**: Add, edit, delete, and view comprehensive employee profiles.
- **Inventory Management**: Track stock levels, add new products, and monitor low inventory.
- **Sales Management**: Record sales transactions and view sales history.
- **Leave Management**: Review and approve/reject employee leave requests.
- **Task Assignment**: Assign tasks to employees and track their completion status.
- **Department Management**: Organize employees into departments.
- **Announcements**: Post system-wide announcements for all employees.
- **Attendance Management**: Monitor employee attendance records.

### **Employee Module**
- **Dashboard**: Personal dashboard with quick access to tasks and announcements.
- **Profile**: View and manage personal details.
- **Task Management**: View assigned tasks and update their status.
- **Leave Requests**: Apply for leave and track request status.
- **Attendance**: Mark daily attendance and view history.

### **Authentication & Security**
- **Role-Based Access Control (RBAC)**: Secure access for Admins and Employees.
- **JWT Authentication**: Secure login sessions with JSON Web Token.
- **Password Hashing**: Bcrypt ensures passwords are store securely.
- **Protected Routes**: React Router guards tailored for specific roles.

---

## 🛠️ Tech Stack

### **Frontend (`/erp`)**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management & Routing**: React Router Dom 7
- **HTTP Client**: Axios
- **Visualization**: Chart.js, Recharts
- **Icons**: Lucide React, React Icons

### **Backend (`/server`)**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Security**: CORS, express-rate-limit

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: Local instance running or a cloud cluster URI

---

## 📥 Installation & Setup

Clone the repository:
```bash
git clone <repository-url>
cd ERP_System
```

### 1. Backend Setup (`/server`)

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/erp
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRE=7d
```

**Database Seeding (Optional):**
To populate the database with an initial Admin account:
```bash
node scripts/seedAdmin.js
```
*(Note: You can check `scripts/seedData.js` for additional dummy data seeding if available)*

Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# OR Production mode
npm start
```
The server will run on `http://localhost:5000` (or your defined PORT).

### 2. Frontend Setup (`/erp`)

Navigate to the frontend directory and install dependencies:
```bash
cd ../erp
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```
ERP_System/
├── erp/                  # Frontend Application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # Dashboard and Page layouts
│   │   ├── pages/        # Application pages (Admin/Employee views)
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/               # Backend API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth and Error handling middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes definitions
│   ├── scripts/          # Database seeding scripts
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
│
└── README.md             # Project Documentation
```

## 🔗 API Endpoints

Base URL: `/api`

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/login` | User login |
|          | GET  | `/auth/verify` | Verify token |
| **Employees** | GET | `/employees` | List all employees |
|               | POST | `/employees` | Add new employee |
| **Inventory** | GET | `/inventory` | List products |
| **Sales**     | POST | `/sales` | Record a sale |
| **Leaves**    | POST | `/leaves` | Submit leave request |
| **Tasks**     | POST | `/tasks` | Assign a task |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
