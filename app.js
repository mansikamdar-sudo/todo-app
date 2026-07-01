const board = document.getElementById("board");
const addListBtn = document.getElementById("addListBtn");

const colors = [
  "#EDE5D6",
  "#DCEFD8",
  "#E8DDED",
  "#EAB9B3",
  "#E0E0E0"
];

let todoLists =
  JSON.parse(localStorage.getItem("todoLists")) || [
    {
      title: "Daily To-Do",
      date: "Today",
    tasks: [
  { text: "Stay positive", completed: false },
  { text: "Deep clean floors", completed: false },
  { text: "Wash windows", completed: false }
]
    },
    {
      title: "Work To-Do",
      date: "Tomorrow",
      tasks: [
  { text: "Reply emails", completed: false },
  { text: "Finish UI Design", completed: false }
]
    }
  ];

  todoLists.forEach(list => {
  list.tasks = list.tasks.map(task =>
    typeof task === "string"
      ? { text: task, completed: false }
      : task
  );
});

renderLists();

addListBtn.addEventListener("click", () => {

  const title = prompt("List name");

  if (!title) return;

  todoLists.push({
    title,
    date: "Today",
    tasks: []
  });

  saveAndRender();
});

function renderLists() {

  board.innerHTML = "";

  todoLists.forEach((list, index) => {

    const card = document.createElement("div");
    card.className = "card";

    card.style.background =
      colors[index % colors.length];

   card.innerHTML = `
<div class="card-top">

    <h3>${list.title}</h3>

    <button
      class="trash-btn"
      onclick="deleteList(${index})">
      <i class="fa-regular fa-trash-can"></i>
    </button>

</div>

<div class="card-date">
    <i class="fa-regular fa-calendar"></i>
    <span>${list.date}</span>
</div>

<ul class="task-list">

${
list.tasks.map((task,taskIndex)=>`

<li class="task ${task.completed ? "completed" : ""}">

<input
  type="checkbox"
  ${task.completed ? "checked" : ""}
  onchange="toggleTask(${index},${taskIndex})"
/>

<span>${task.text ?? task}</span>

<button
  class="delete-btn"
  onclick="deleteTask(${index},${taskIndex})">
  ×
</button>

</li>

`).join("")
}

</ul>

<input
class="add-task"
placeholder="+ Add a task"
onkeypress="addTask(event,${index})"
/>
`;

    board.appendChild(card);
  });
}

function addTask(event, listIndex) {

  if (event.key !== "Enter") return;

  const value = event.target.value.trim();

  if (!value) return;

  todoLists[listIndex].tasks.push({
  text: value,
  completed: false
});

  saveAndRender();
}

function deleteTask(listIndex, taskIndex) {

  todoLists[listIndex].tasks.splice(taskIndex,1);

  saveAndRender();
}

function deleteList(index) {

  todoLists.splice(index,1);

  saveAndRender();
}

function toggleTask(listIndex, taskIndex) {

  todoLists[listIndex].tasks[taskIndex].completed =
    !todoLists[listIndex].tasks[taskIndex].completed;

  saveAndRender();
}

function saveAndRender() {

  localStorage.setItem(
    "todoLists",
    JSON.stringify(todoLists)
  );

  renderLists();
}

document.getElementById("currentDate").innerHTML =
  new Date().toLocaleDateString("en-US",{
    weekday:"short",
    month:"short",
    day:"numeric"
  });