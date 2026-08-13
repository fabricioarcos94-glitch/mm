const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const progress = document.getElementById("progress");
const progressPercent = document.getElementById("progressPercent");
const progressText = document.getElementById("progressText");

const message = document.getElementById("message");
const submessage = document.getElementById("submessage");

let tasks = JSON.parse(localStorage.getItem("monkiTasks")) || [];

let currentFilter = "all";

/* FECHA */

const today = new Date();

document.getElementById("date").textContent =
    today.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

/* AGREGAR TAREA */

addTask.addEventListener("click", addNewTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addNewTask();
    }
});

function addNewTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("🐒 Escribe una tarea primero.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        priority: priority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

/* MOSTRAR TAREAS */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `

            <div class="check"
                onclick="toggleTask(${task.id})">
            </div>

            <div class="task-content">

                <div class="task-name">
                    ${escapeHTML(task.text)}
                </div>

                <span class="priority ${task.priority}">
                    ${getPriorityName(task.priority)}
                </span>

            </div>

            <button
                class="delete"
                onclick="deleteTask(${task.id})">
                🗑️
            </button>
        `;

        taskList.appendChild(taskElement);

    });

    updateProgress();
}

/* COMPLETAR */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;

    });

    saveTasks();
    renderTasks();

    motivation();
}

/* ELIMINAR */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

/* PRIORIDAD */

function getPriorityName(priority) {

    if (priority === "alta") {
        return "🔴 Alta";
    }

    if (priority === "media") {
        return "🟡 Media";
    }

    return "🟢 Baja";
}

/* PROGRESO */

function updateProgress() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progress.style.width = percentage + "%";

    progressPercent.textContent =
        percentage + "%";

    progressText.textContent =
        `${completed} de ${total} tareas completadas`;

    if (percentage === 100 && total > 0) {

        message.textContent = "🎉 ¡LO LOGRASTE!";

        submessage.textContent =
            "Todas tus tareas están completas. ¡Estoy orgulloso de ti! 🐒💜";

    } else if (percentage >= 70) {

        message.textContent = "🔥 ¡Ya casi terminas!";

        submessage.textContent =
            "Estás muy cerca. ¡No te rindas ahora!";

    } else if (percentage >= 30) {

        message.textContent = "💪 ¡Vas muy bien!";

        submessage.textContent =
            "Sigue avanzando poquito a poquito.";

    } else {

        message.textContent = "🐒 ¡Tú puedes!";

        submessage.textContent =
            "Vamos paso a paso. Hoy será un gran día.";
    }
}

/* FILTROS */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});

/* GUARDAR */

function saveTasks() {

    localStorage.setItem(
        "monkiTasks",
        JSON.stringify(tasks)
    );

}

/* SEGURIDAD DEL TEXTO */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* MENSAJE MOTIVADOR */

function motivation() {

    const messages = [
        "🐒 ¡Cada tarea terminada es un paso más!",
        "💜 ¡Lo estás haciendo genial!",
        "🔥 ¡Sigue así, campeón!",
        "✨ ¡Un poquito cada día!",
        "🚀 ¡Tus metas están más cerca!",
        "🐵 ¡Monki cree en ti!"
    ];

    const random =
        messages[Math.floor(Math.random() * messages.length)];

    message.textContent = random;
}

/* INICIAR */

renderTasks();