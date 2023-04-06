const input = document.querySelector("#todo-creation");
const button = document.querySelector("#create-todo-button");
const output = document.querySelector("#output");
const usersOutput = document.querySelector("#users-output");
const clearCurrentUserButton = document.querySelector("#clear-current-user");
const searchTodoInput = document.querySelector("#todo-search");
const buttonUp = document.querySelector("#btn-up");
const clearSearchInput = document.querySelector("#clear-search-input");

const isLocalStorageTodosExists = localStorage.getItem("todos")


let todos = isLocalStorageTodosExists
    ? JSON.parse(isLocalStorageTodosExists) : [];
console.log(`AllArrTodo = ${todos.length}`, todos);
renderTodos(todos);
getServerUsers();

let users = [];
console.log(`AllArrUsers = ${users.length}`, users);

let currentUser = undefined;

button.onclick = () => {

    const todo = {
        text: input.value,
        done: false, 
    }
    input.value = "";

    todo.text !== "" && todos.push(todo);
    if(todos.length > 0){
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    renderTodos(todos);
}

function renderTodos (todosToRender) {
localStorage.setItem("todos", JSON.stringify(todos));

    output.innerHTML = "";
    todosToRender.forEach((todo, i) => {
        output.innerHTML += `
        <div class="todo ${todo.done && "done"}">
            <div>
                <span>${i+1}.</span>
                <input type="checkbox"  class="todo-checkbox" id="${todo.id}" ${todo.done && "checked"} />
                <span>${todo.text}</span>
            </div>
            <button id="${todo.id}" class="delete-todo">Delete</button>
        </div>
        `
    });

    const checkboxes = [...document.querySelectorAll(".todo-checkbox")];

    checkboxes.forEach((checkbox) => {
        checkbox.onchange = () => {
            const todo = todos.find((todo) => todo.id === +checkbox.id);
            console.log("!!!todo", checkbox.id);
            changeTodo(todo.id, !todo.done);
        };
    });

    const deleteButtons = [...document.querySelectorAll(".delete-todo")];

    deleteButtons.forEach((button) => {
        button.onclick = () => {
            const todo = todos.find((todo) => todo.id === +button.id); 
            deleteTodo(todo.text);
        };
    });
}

function changeTodo (id, newDone) {
    todos = todos.map((todo) => {
        if(todo.id === id) {
            return { ...todo, done: newDone };
        }
        return todo;
    });
    renderTodos(currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos);
}

function deleteTodo (text) {
    todos = todos.filter((todo) => todo.text !== text);

    renderTodos(currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos);
}

function searchTodo (value) {
    const filteredTodo = currentUser 
        ? todos.filter((todo) => todo.text.includes(value) && todo.userId === currentUser.id)
        : todos.filter((todo) => todo.text.includes(value));
    
    renderTodos(filteredTodo);
}

function getServerTodos () {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(todosFromServer => {
            const transformedTodos = todosFromServer.map((todo) => {
               return {
                text: todo.title,
                done: todo.completed,
                userId: todo.userId,
                id: todo.id,
               };
            });
            
            console.log("transform: ",transformedTodos);

            todos = transformedTodos;
            renderTodos(todos);
            
        });
}

function getServerUsers () {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(usersFromServer => {
            console.log("users from server: ", usersFromServer)

            users = usersFromServer;
            renderUsres(users);
        })
}

function renderUsres () {
    usersOutput.innerHTML = "";
    users.forEach((user) => {
        usersOutput.innerHTML += `
            <button class="user-todos-button">${user.name}</button></button>
        `;
    });

    const userButtons = [...document.querySelectorAll(".user-todos-button")];

    userButtons.forEach((button, i) => {
        button.onclick = (event) => {
            searchTodoInput.value = "";
            currentUser = users[i];
            clearCurrentUserButton.disabled = false;

            //щоб не було декільув видшдених кнопок, спочатку чистемо усі кнопки
            userButtons.forEach((btn) => btn.classList.remove("active-user-button"));

            //якщо натиснули на кнопку, то так денамічно добавляємо тегу ще один клас 
            event.target.classList.add("active-user-button");

            const todosOfCurrentUser = todos.filter((todo) => todo.userId === currentUser.id)
            renderTodos(todosOfCurrentUser);
        }
    });
}

clearCurrentUserButton.disabled = true;

clearCurrentUserButton.onclick = () => {
    currentUser = undefined;
    clearCurrentUserButton.disabled = true;
    
    const userButtons = [...document.querySelectorAll(".user-todos-button")];
    userButtons.forEach((btn) => btn.classList.remove("active-user-button"));
    
    renderTodos(todos);
    }

searchTodoInput.oninput = () => {
    console.log(searchTodoInput.value);
    searchTodo(searchTodoInput.value)
}

buttonUp.onclick = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};

clearSearchInput.onclick = () => {
    searchTodoInput.value = "";
    const todosToRender = currentUser 
        ? todos.filter((todo) => todo.userId === currentUser.id)
        : todos;
 
    const userButtons = [...document.querySelectorAll(".user-todos-button")];
    clearCurrentUserButton.disabled = true;
    
    userButtons.forEach((btn) => btn.classList.remove("active-user-button"));
    
    renderTodos(todosToRender);
};

