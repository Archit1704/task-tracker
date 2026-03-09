const API = ""

let chartInstance = null


async function loadTasks(){

    const res = await fetch(`${API}/tasks`)
    const tasks = await res.json()

    const list = document.getElementById("taskList")
    list.innerHTML = ""

    tasks.forEach(task => {

        const li = document.createElement("li")

        li.innerHTML = `
        <span>${task.title} - ${task.status}</span>

        <select onchange="updateStatus(${task.id}, this.value)">
            <option value="pending" ${task.status==="pending"?"selected":""}>Pending</option>
            <option value="in_progress" ${task.status==="in_progress"?"selected":""}>In Progress</option>
            <option value="completed" ${task.status==="completed"?"selected":""}>Completed</option>
        </select>
        `

        list.appendChild(li)

    })

}


async function addTask(){

    const title = document.getElementById("title").value
    const description = document.getElementById("description").value

    await fetch(`${API}/tasks`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title,
            description
        })
    })

    document.getElementById("title").value=""
    document.getElementById("description").value=""

    loadTasks()
    loadStats()

}


async function updateStatus(id,status){

    await fetch(`${API}/tasks/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            status
        })
    })

    loadTasks()
    loadStats()

}


async function loadStats(){

    const res = await fetch(`${API}/stats`)
    const stats = await res.json()

    const labels = stats.map(s => s.status)
    const data = stats.map(s => s.count)

    const ctx = document.getElementById("chart")

    if(chartInstance){
        chartInstance.destroy()
    }

    chartInstance = new Chart(ctx,{
        type:"pie",
        data:{
            labels:labels,
            datasets:[{
                data:data
            }]
        }
    })

}


loadTasks()
loadStats()