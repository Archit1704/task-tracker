const API = "";

let chartInstance = null;
const token = localStorage.getItem("token");
const statusOrder = ["pending", "in_progress", "completed"];
const statusConfig = {
    pending: { label: "Pending", color: "#f3b43f", icon: "🟡" },
    in_progress: { label: "In Progress", color: "#4f8cff", icon: "🔵" },
    completed: { label: "Completed", color: "#33b47a", icon: "🟢" }
};

let toastTimer = null;

if (!token) {
    window.location.href = "login.html";
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function renderEmptyState() {
    const list = document.getElementById("taskList");
    list.innerHTML = '<li class="empty-state"><strong>🌙 No tasks yet</strong><span>Add your first task and we will keep it organized here.</span></li>';
    updateTaskHeading(0);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function updateTaskHeading(count) {
    const heading = document.getElementById("taskHeading");
    if (heading) {
        heading.textContent = `Tasks (${count})`;
    }
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    if (!tasks.length) {
        renderEmptyState();
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement("li");
        const config = statusConfig[task.status] || statusConfig.pending;
        li.className = `task-item ${task.status}`;
        li.innerHTML = `
            <div class="task-info">
                <div class="task-meta">
                    <strong>${escapeHtml(task.title)}</strong>
                    <span class="status-badge ${task.status}">${config.icon} ${config.label}</span>
                </div>
                <small>${escapeHtml(task.description || "No description")}</small>
            </div>
            <div class="task-controls">
                <select aria-label="Update task status" onchange="updateStatus(${task.id}, this.value)">
                    <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>In Progress</option>
                    <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
                </select>
                <button class="icon-button" aria-label="Delete task" onclick="deleteTask(${task.id})">🗑 Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    updateTaskHeading(tasks.length);
}

function setCount(id, value) {
    const node = document.getElementById(id);
    if (node) {
        node.textContent = value;
    }
}

async function loadTasks() {
    try {
        const res = await fetch(`${API}/tasks`, {
            headers: { Authorization: token }
        });

        if (!res.ok) {
            renderEmptyState();
            return;
        }

        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error("LOAD TASK ERROR:", err);
        renderEmptyState();
    }
}

async function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
        alert("Fill all fields properly");
        return;
    }

    try {
        const res = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({ title, description })
        });

        if (!res.ok) {
            alert("Failed to add task");
            return;
        }

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        await loadTasks();
        await loadStats();
        showToast("✨ Task added");
    } catch (err) {
        console.error("ADD TASK ERROR:", err);
    }
}

async function updateStatus(id, status) {
    try {
        await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({ status })
        });

        await loadTasks();
        await loadStats();
        showToast("📌 Status updated");
    } catch (err) {
        console.error("UPDATE STATUS ERROR:", err);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        });

        await loadTasks();
        await loadStats();
        showToast("🗑 Task removed");
    } catch (err) {
        console.error("DELETE TASK ERROR:", err);
    }
}

async function loadStats() {
    try {
        const res = await fetch(`${API}/stats`, {
            headers: { Authorization: token }
        });

        if (!res.ok) {
            return;
        }

        const stats = await res.json();
        const counts = Object.fromEntries(statusOrder.map(status => [status, 0]));

        stats.forEach(item => {
            if (item.status in counts) {
                counts[item.status] = item.count;
            }
        });

        setCount("pendingCount", counts.pending);
        setCount("progressCount", counts.in_progress);
        setCount("completedCount", counts.completed);
        setCount("pendingLabelCount", counts.pending);
        setCount("progressLabelCount", counts.in_progress);
        setCount("completedLabelCount", counts.completed);

        const ctx = document.getElementById("chart");
        if (!ctx) {
            return;
        }

        const labels = statusOrder.map(status => statusConfig[status].label);
        const data = statusOrder.map(status => counts[status]);
        const colors = statusOrder.map(status => statusConfig[status].color);

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderColor: "#121821",
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (err) {
        console.error("STATS ERROR:", err);
    }
}

loadTasks();
loadStats();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
