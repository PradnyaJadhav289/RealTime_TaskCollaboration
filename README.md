📄 FULL STACK ENGINEER INTERVIEW ASSIGNMENT
Real-Time Task Collaboration Platform
🔗 Live Demo
# Frontend (Vercel): 
https://real-time-task-collaboration-c-git-7349ec-pjadhav1234s-projects.vercel.app/

# Backend (Render): 
https://realtime-taskcollaboration-3.onrender.com

# GitHub Repository: 
https://github.com/PradnyaJadhav289/RealTime_TaskCollaboration

# 🧠 Problem Statement

Build a Real-Time Task Collaboration Platform similar to a lightweight Trello/Notion hybrid.

# Users can:
Create boards
Manage lists & tasks
Assign members
Drag & drop tasks
See real-time updates

# 🏗️ Tech Stack

# Frontend 
React (SPA)
Redux Toolkit (State Management)
Axios (API Layer)
DnD Kit (Drag & Drop)
Socket.IO Client

# Backend
Node.js + Express
MongoDB + Mongoose
JWT Authentication
Socket.IO (Realtime)
REST APIs

# Deployment
1. Layer Platform
2. Frontend	Vercel
3. Backend	Render
4. Database	MongoDB Atlas

# ⚙ Functional Requirements Implemented

1. User Authentication (Signup/Login)
2. Create Boards with Lists
3. Create / Update / Delete Tasks
4. Drag & Drop Tasks
5. Assign Users to Tasks
6. Real-time Sync (Socket.IO)
7. Activity Logging
8. Search + Pagination
9. Protected Routes

# 🧱 Frontend Architecture
client/
│
├── src/
│   ├── api/          → Axios services
│   ├── app/          → Redux store
│   ├── features/     → Redux slices
│   ├── components/
│   │     ├── Board
│   │     ├── List
│   │     ├── Task
│   │     └── Common
│   ├── pages/
│   ├── hooks/
│   └── routes/

# State Management

Redux Toolkit used for:

auth
boards
tasks
socket state

# 🧩 Backend Architecture
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
├── routes/
├── middleware/
├── services/
└── utils/

# 🗄️ Database Schema Design
1. User
name
email
password

2. Board
title
owner
members[]

3. List
title
board
order

4. Task
title
description
board
list
assignedUsers[]
priority
dueDate
createdBy

5. ActivityLog
board
user
action
task
meta

# 🔌 API Contract Design
1. Auth
POST /api/auth/register
POST /api/auth/login

2. Boards
GET    /api/boards
POST   /api/boards
GET    /api/boards/:id
DELETE /api/boards/:id

3. Lists
GET    /api/lists/:boardId
POST   /api/lists

4. Tasks
GET    /api/tasks/:boardId
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

5. Activity
GET /api/activity/:boardId

# ⚡ Real-Time Sync Strategy

Implemented using Socket.IO.

Events
join_board
task_created
task_updated
task_moved
task_deleted
activity_created

# Flow
Client action
     ↓
API Update
     ↓
DB Update
     ↓
Socket Emit
     ↓
All clients update UI

# UI Architecture

Board Page Layout:

BoardHeader
    ↓
BoardContainer
       ↓
Lists (columns)
       ↓
Tasks

Activity Sidebar (Realtime)

Search & Pagination
GET /tasks?page=1&limit=10&search=design


# Supports:

keyword search
status filter
priority filter

# 🧠 Scalability Considerations

Pagination to reduce DB load
Socket rooms per board
Indexed Mongo fields
Optimistic UI updates
Modular service layer architecture

# 🔐 Security

JWT authentication
Protected API routes
Password hashing (bcrypt)
Role-based checks for boards

# 🧪 Test Coverage

* Basic testing included:
Authentication flow
CRUD APIs
API integration testing

# Deployment Strategy
Backend (Render)
Root directory → server

* Start command → node server.js

* Environment variables configured

* Frontend (Vercel)

# Production API URL via ENV variable:

VITE_API_URL=https://backend.onrender.com/api

#  Assumptions & Trade-offs

Minimal UI styling focused on functionality.
Basic role system (owner/member).
Socket events optimized for board-level updates.

#  Demo Credentials
Email: sanika123@gmail.com
Password: 123456

# Key Highlights

1. Real-time collaboration system
2. Drag & drop Kanban board
3. Activity logging
4. Socket-based synchronization

Full production deployment

