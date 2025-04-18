import './style.css';
import { TodoList } from './classes/todolist';

//Skapa en instans av klassen
const todoList = new TodoList();

//Hämta element
const taskInput = document.getElementById("todo") as HTMLInputElement;
const prioritySelect = document.getElementById("priority") as HTMLSelectElement;
const addToDo = document.getElementById("addToDo") as HTMLButtonElement;

//Addera händelselyssnare
addToDo.addEventListener("click", () => {
  const task = taskInput.value;
  const priority = Number(prioritySelect.value);

  const success = todoList.addTodo(task, priority);

  if (success) {
    renderTodos();
    taskInput.value = "";
    prioritySelect.value = "";
  } else {
    alert("Felaktig inmatning. Kontrollera att uppgiften inte är tom och att prioritet är 1-3");
  }
});

//Skriv ut min nya to do
const todoListEl = document.getElementById("todoList") as HTMLUListElement;

function renderTodos(): void {
  todoListEl.innerHTML = "";

  //Sorterar min array efter priority.
  const todos = todoList.getTodos().slice().sort((a, b) => a.priority - b.priority);

  todos.forEach((todo, index) => {
    const li = document.createElement("li");

    //Skapa en unik id för varje checkbox
    const checkboxId = `todo-checkbox-${index}`;

    //Skapa checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxId;
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      todoList.saveToLocalStorage();
      span.classList.toggle("completed", todo.completed);
    });

    //Skapar label för tillgänglighet och kopplar till checkbox
    const label = document.createElement("label");
    label.htmlFor = checkboxId;
    label.classList.add("visually-hidden"); // Döljer visuellt men finns för skärmläsare
    label.textContent = "Markera som klar";

    //Adderar span i li för CSS skull. Så att det inte radera-knappen räknas med i "completed".
    const span = document.createElement("span");
    span.textContent = `${todo.task} (prio ${todo.priority})`;
    if (todo.completed) {
      span.classList.add("completed");
    }

    //Addera en radera-knapp till varje li-element.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "RADERA";
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", () => {
      todoList.removeTodo(todo); //Anropa raderametoden.
      renderTodos();
    });

    //Lägg till alla delar i li
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(span);
    li.appendChild(deleteButton);
    todoListEl.appendChild(li);
  });
}

//För att visa alla todos direkt när sidan laddas. 
renderTodos();