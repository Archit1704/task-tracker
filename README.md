# 📌 Task Tracker API

A simple **Task Tracker REST API** built with **Node.js, Express, and MySQL**.
This project allows users to **create, view, update, and analyze tasks** efficiently.

---

## 🚀 Tech Stack

* 🟢 Node.js
* ⚡ Express.js
* 🗄️ MySQL
* 🎨 HTML, CSS, JavaScript (Frontend)

---

## ✨ Features

* ➕ Create new tasks
* 📋 View all tasks
* 🔄 Update task status
* 📊 Task statistics (completed, pending, etc.)

---

## 📁 Project Structure

```
task-tracker/
│
├── frontend/        # 🌐 Frontend files (HTML, CSS, JS)
├── server.js        # 🚀 Express server and API routes
├── db.js            # 🗄️ Database connection
├── package.json     # 📦 Project dependencies
├── package-lock.json
└── .gitignore
```

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker
```

Install dependencies

```
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskdb
PORT=3000
```

---

## ▶️ Running the Server

Start the backend server

```
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### ➕ Create Task

```
POST /tasks
```

### 📋 Get All Tasks

```
GET /tasks
```

### 🔄 Update Task Status

```
PUT /tasks/:id
```

### 📊 Task Statistics

```
GET /stats
```

---

## 🔮 Future Improvements

* 🔐 Authentication system
* 🐳 Docker containerization
* ⚙️ CI/CD pipeline
* ☁️ Deployment using AWS EC2 and Nginx

---

## 👨‍💻 Author

**Archit Sharma**
