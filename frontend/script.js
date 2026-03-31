const API = "http://localhost:3000";

let chartInstance = null;
let token = localStorage.getItem("token");
console.log("TOKEN:", token);
// 🧠 login manually from console for now
// localStorage.setItem("token", "PASTE_TOKEN")
// let token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function loadTasks() {

    try {
        const res = await fetch(`${API}/tasks`, {
            headers: { Authorization: token }
        });

        const text = await res.text();
        console.log("LOAD TASKS STATUS:", res.status);
        console.log("LOAD TASKS RESPONSE:", text);

        if (!res.ok) return;

        const tasks = JSON.parse(text);

        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach(task => {

            const li = document.createElement("li");

            li.innerHTML = `
            <div class="task-info">
                <strong>${task.title}</strong>
                <small>${task.description}</small>
            </div>

            <div>
                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="pending" ${task.status==="pending"?"selected":""}>Pending</option>
                    <option value="in_progress" ${task.status==="in_progress"?"selected":""}>In Progress</option>
                    <option value="completed" ${task.status==="completed"?"selected":""}>Completed</option>
                </select>

                <button onclick="deleteTask(${task.id})">❌</button>
            </div>
            `;

            list.appendChild(li);
        });

    } catch (err) {
        console.error("LOAD TASK ERROR:", err);
    }
}


async function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

   if (!title.trim() || !description.trim()) {
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

        const text = await res.text(); // safer than json
        console.log("STATUS:", res.status);
        console.log("RESPONSE:", text);

        if (!res.ok) {
            console.error("Failed to add task");
            return;
        }

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        loadTasks();
        loadStats();

    } catch (err) {
        console.error("ERROR:", err);
    }
}

async function updateStatus(id, status) {

    await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({ status })
    });

    loadTasks();
    loadStats();
}

async function deleteTask(id) {

    await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token
        }
    });

    loadTasks();
    loadStats();
}


async function loadStats() {

    try {
        const res = await fetch(`${API}/stats`, {
            headers: { Authorization: token }
        });

        const text = await res.text();
        console.log("STATS STATUS:", res.status);
        console.log("STATS RESPONSE:", text);

        if (!res.ok) return;

        const stats = JSON.parse(text);

        const labels = stats.map(s => s.status);
        const data = stats.map(s => s.count);

        const ctx = document.getElementById("chart");

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [{ data }]
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