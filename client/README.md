# 📌 Real-Time Task Collaboration Platform

A **Trello / Notion-like Real-Time Task Collaboration Platform** built using the **MERN Stack**, Redux Toolkit, and Socket.IO.

This application allows users to:

* Create boards, lists, and tasks
* Collaborate in real-time
* Assign members
* Drag & drop tasks
* Track activity logs
* Secure authentication using JWT

---

# 🚀 Tech Stack

## Frontend

* React.js
* Redux Toolkit
* React Router
* Axios
* Socket.IO Client
* Drag & Drop (dnd-kit / react-beautiful-dnd)

## Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO

---

# 📂 Project Structure

```
project-root/
│
├── client/        # React Frontend
└── server/        # Node.js Backend
```

---

# 🌐 CLIENT — Detailed Folder Structure

```
client/
│
├── public/
│   ├── index.html
│   └── assets/
│
├── src/
│
│   ├── api/
│   │   ├── axios.js
│   │   ├── authApi.js
│   │   ├── boardApi.js
│   │   └── taskApi.js
│   │
│   ├── app/
│   │   └── store.js
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   ├── authThunk.js
│   │   │   └── authSelectors.js
│   │   │
│   │   ├── board/
│   │   │   ├── boardSlice.js
│   │   │   ├── boardThunk.js
│   │   │   └── boardSelectors.js
│   │   │
│   │   ├── task/
│   │   │   ├── taskSlice.js
│   │   │   ├── taskThunk.js
│   │   │   └── taskSelectors.js
│   │   │
│   │   └── socket/
│   │       └── socketSlice.js
│   │
│   ├── components/
│   │   ├── Board/
│   │   │   ├── BoardContainer.jsx
│   │   │   ├── BoardHeader.jsx
│   │   │   └── BoardMembers.jsx
│   │   │
│   │   ├── List/
│   │   │   ├── ListCard.jsx
│   │   │   ├── ListHeader.jsx
│   │   │   └── AddList.jsx
│   │   │
│   │   ├── Task/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── AddTask.jsx
│   │   │
│   │   └── Common/
│   │       ├── Loader.jsx
│   │       ├── Navbar.jsx
│   │       ├── Modal.jsx
│   │       └── SearchBar.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── BoardPage.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBoard.js
│   │   ├── useTask.js
│   │   └── useSocket.js
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── dragDropHelpers.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

## 📌 Client Folder Purpose

| Folder     | Purpose                    |
| ---------- | -------------------------- |
| api        | Axios API calls            |
| app        | Redux store setup          |
| features   | Redux Toolkit slices       |
| components | Reusable UI components     |
| pages      | Main screens               |
| hooks      | Custom reusable hooks      |
| routes     | Routing & protected routes |
| utils      | Helper utilities           |
| styles     | Global styling             |

---

# ⚙️ SERVER — Detailed Folder Structure

```
server/
│
├── config/
│   ├── db.js
│   └── socket.js
│
├── models/
│   ├── User.js
│   ├── Board.js
│   ├── List.js
│   ├── Task.js
│   └── ActivityLog.js
│
├── controllers/
│   ├── authController.js
│   ├── boardController.js
│   ├── listController.js
│   └── taskController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── boardRoutes.js
│   └── taskRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── activityLogger.js
│
├── services/
│   ├── socketService.js
│   └── taskService.js
│
├── utils/
│   ├── generateToken.js
│   ├── asyncHandler.js
│   ├── constants.js
│   ├── validators.js
│   ├── pagination.js
│   ├── socketEvents.js
│   └── logger.js
│
├── tests/
│
├── app.js
└── server.js
```

---

## 📌 Server Folder Purpose

| Folder      | Purpose                   |
| ----------- | ------------------------- |
| config      | DB & Socket configuration |
| models      | MongoDB schemas           |
| controllers | Request handling logic    |
| routes      | API endpoints             |
| middleware  | Auth & error handling     |
| services    | Business logic layer      |
| utils       | Helper functions          |
| tests       | Testing files             |

---

# 🔄 Application Flow

```
Frontend (React + Redux)
        ↓
Axios API Calls
        ↓
Express Routes
        ↓
Controllers
        ↓
Services
        ↓
MongoDB Models
        ↓
Socket.IO Events (Realtime)
        ↓
All Clients Updated
```

---

# ⚡ Installation Guide

## 1️⃣ Clone Repository

```
git clone <repo-url>
cd project-root
```

---

## 2️⃣ Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

## 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

# 🔐 Environment Variables

```
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

---

# 🔥 Key Features

* JWT Authentication
* Board & Task Management
* Drag & Drop Task Movement
* Real-Time Collaboration (Socket.IO)
* Activity Tracking
* Redux Toolkit State Management
* Scalable Modular Architecture

---

# 🧠 Architecture Highlights

* Feature-based Redux structure
* Service layer backend design
* Clean separation of concerns
* Realtime synchronization
* Industry-standard folder organization

---

# 🧪 Future Improvements

* Role-based permissions
* Notifications
* File uploads
* Dark mode
* Analytics dashboard

---

# 👨‍💻 Author

Full Stack MERN Project — Real-Time Task Collaboration Platform.
