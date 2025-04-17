import { Todo } from "../models/todo";

export class TodoList {

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

