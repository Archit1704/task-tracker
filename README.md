# 📌 Task Tracker (v2.0)

A full-stack **Task Management Application** built with **Node.js, Express, MySQL, and Vanilla JS**.

This project evolved from a basic task API to a **user-based task system with authentication, validation, and analytics**.

---

## 🚀 Tech Stack

* 🟢 Node.js
* ⚡ Express.js
* 🗄️ MySQL
* 🔐 JWT Authentication
* 🎨 HTML, CSS, JavaScript

---

## ✨ Features

### 🔐 Authentication

* User signup & login
* JWT-based authentication
* Protected routes (user-specific data)

### 📋 Task Management

* ➕ Create tasks
* 📥 View user-specific tasks
* 🔄 Update task status
* ❌ Delete tasks

### 📊 Analytics

* Task statistics (pending, completed, etc.)
* Visualized using charts

### 🛡️ Validation

* Frontend + backend validation
* Prevents empty or invalid data

---

## 📁 Project Structure

```
task-tracker/
│
├── frontend/        # 🌐 Frontend (HTML, CSS, JS)
├── server.js        # 🚀 Backend (Express API)
├── db.js            # 🗄️ Database connection
├── package.json
└── .gitignore
```

---

## ⚙️ Installation

```bash
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskdb
PORT=3000
JWT_SECRET=secretkey
```

---

## ▶️ Run the Project

```bash
node server.js
```

Open:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### 🔐 Auth

* `POST /signup`
* `POST /login`

### 📋 Tasks (Protected)

* `POST /tasks` → Create task
* `GET /tasks` → Get user tasks
* `PUT /tasks/:id` → Update status
* `DELETE /tasks/:id` → Delete task

### 📊 Stats

* `GET /stats` → Task statistics

---

## 🏷️ Versioning

* `v1.0` → Basic task API
* `v2.0` → Authentication + user-specific tasks + validation + stats

---

## 🔮 Future Improvements

* 🌐 Deploy on AWS EC2 with domain & SSL
* ⚙️ CI/CD pipeline (Jenkins)
* 🐳 Docker containerization
* ⏱️ Task deadlines & reminders

---

## 👨‍💻 Author

**Archit Sharma**

