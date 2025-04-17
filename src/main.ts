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
    console.log("Todo tillagd");
    taskInput.value = "";
    prioritySelect.value = "";
  } else {
    alert("Felaktig inmatning. Kontrollera att uppgiften inte är tom och att prioritet är 1-3");
  }
});