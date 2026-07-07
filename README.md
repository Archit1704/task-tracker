# Task Tracker

A full-stack task tracking app built with Node.js, Express, MySQL, and vanilla frontend code.

The current UI is a dark, responsive workspace with:
- JWT-based login and signup
- task creation, status updates, and deletion
- a live task overview with counts and chart summary
- a matching login and dashboard design
- mobile-friendly layouts without horizontal overflow

## Stack

- Node.js
- Express
- MySQL
- JWT authentication
- HTML, CSS, JavaScript
- Chart.js

## Features

- User signup and login
- Protected task routes with token auth
- Create, view, update, and delete tasks
- Status overview with chart and counters
- Responsive dark theme for login and dashboard
- Frontend validation for empty task input

## Project Structure

```text
task-tracker/
├── frontend/
│   ├── index.html
│   ├── login.html
│   └── script.js
├── db.js
├── server.js
├── package.json
└── README.md
```

## Setup

```bash
npm install
```

Create a `.env` file with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskdb
PORT=3000
JWT_SECRET=secretkey
```

## Run

```bash
node server.js
```

Open `http://localhost:3000`.

## API

Auth:
- `POST /signup`
- `POST /login`

Tasks:
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Stats:
- `GET /stats`

## Notes

- The recent UI changes are frontend-only and do not require database changes.
- The login page and dashboard now share the same visual style and responsive behavior.

## Next Ideas

- Add task filters like `All`, `Pending`, and `Completed`
- Add inline task editing
- Add due dates and reminders
- Add deployment and CI/CD setup
