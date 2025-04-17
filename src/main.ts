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

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = `${todo.task} (prio ${todo.priority})`;
    li.classList.add("todoItem");

    //Addera en KLAR-knapp till todos som inte är klara
    if (todo.completed) {
      li.classList.add("completed");
    } else {
      const doneButton = document.createElement("button");
      doneButton.textContent = "KLAR";
      doneButton.classList.add("doneButton");
      doneButton.addEventListener("click", () => {
        //Min instans av TodoList anropar metoden markTodoCompleted och skickar med index som argument.
        todoList.markTodoCompleted(todo);
        renderTodos();
      });

      //Adderar knappen till li-elementet och lägger in li-elementet i ul-listan.
      li.appendChild(doneButton);
    }

    //Addera en radera-knapp till varje li-element.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "RADERA";
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", () => {
      todoList.removeTodo(todo); //Anropa raderametoden.
      renderTodos();
    });

    li.appendChild(deleteButton);
    todoListEl.appendChild(li);
  });
}

//För att visa alla todos direkt när sidan laddas. 
renderTodos();