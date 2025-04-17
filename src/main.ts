import './style.css';

interface Todo {    //Börja med versal enligt konventionen i TS.
  task: string,
  completed: boolean,
  priority: number,
}

class TodoList {

  //Privat variabel för att skydda listan
  private todos: Todo[] = [];

  //När du skapar en ny todo så hämtas sparade todos från listan direkt så den inte tappas när sidan laddas om.
  constructor() {
    this.loadFromLocalStorage();
  }

  addTodo(task: string, priority: number): boolean {

    //Om man inte skrivit någon todo eller att priority är mindre än 1 eller mer än 3 - returnera false.
    if (!task || priority < 1 || priority > 3) {
      return false;
    }

    //Annars addera en ny todo
    const newTodo: Todo = {
      task: task.trim(),
      completed: false,
      priority: priority,
    };

    //Pusha till listan arrayen och spara direkt i local storage.
    this.todos.push(newTodo);
    this.saveToLocalStorage();
    return true;
  }

  //Returnerar den privata todo-arrayen så att jag kan använda den utanför klassen.
  getTodos(): Todo[] {
    return this.todos;
  }

  //Markera en todo som klar genom att skicka med vald index i todo-arrayen och ändra den till completed = true.
  markTodoCompleted(todoToMark: Todo): void {
    //Använder indexOf för att hitta rätt index i arrayen.
    const index = this.todos.indexOf(todoToMark);
    if (index !== -1) {
      this.todos[index].completed = true;
      this.saveToLocalStorage();
    }
  }

  //Radera en todo
  removeTodo(todoToRemove: Todo): void {
    const index = this.todos.indexOf(todoToRemove);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  //Spara till local storage
  saveToLocalStorage(): void {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  //Ladda från local storage
  loadFromLocalStorage(): void {
    const todosFromStorage = localStorage.getItem("todos");
    if (todosFromStorage) {
      this.todos = JSON.parse(todosFromStorage);
    }
  }

}


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