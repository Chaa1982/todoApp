const input = document.querySelector("#todo-creation");
const button = document.querySelector("#create-todo-button");
const output = document.querySelector("#output");
const usersOutput = document.querySelector("#users-output");
const clearCurentUserButton = document.querySelector("#clear-curent-user");
const searchTodoInput = document.querySelector("#todo-search");

const isLocalStorageTodosExists = localStorage.getItem("todos")


let todos = isLocalStorageTodosExists
    ? JSON.parse(isLocalStorageTodosExists) : [];
console.log(`AllArrTodo = ${todos.length}`, todos);
renderTodos(todos);
getServerUsers();

let users = [];
console.log(`AllArrUsers = ${users.length}`, users);

let curentUser = undefined;

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
                <input type="checkbox" ${todo.done && "checked"} class="todo-checkbox" />
                <span>${todo.text}</span>
            </div>
            <button class="delete-todo">Delete</button>
        </div>
        `
    });

    const checkboxes = [...document.querySelectorAll(".todo-checkbox")];

    checkboxes.forEach((checkbox, i) => {
        checkbox.onchange = () => {
            const todo = todos[i];
            changeTodo(todo.text, !todo.done);
            
        }
    });

    const deleteButtons = [...document.querySelectorAll(".delete-todo")];

    deleteButtons.forEach((button, i) => {
        button.onclick = () => {
            const todo = todos[i];
            deleteTodo(todo.text);
            
        }
    })
}

function changeTodo (text, newDone) {
    todos = todos.map((todo) => {
        if(text === todo.text) {
            return { text, done: newDone }
        }
        return todo;
    });
    renderTodos(curentUser ? todos.filter((todo) => todo.userId === curentUser.id) : todos);
}

function deleteTodo (text) {
    todos = todos.filter((todo) => todo.text !== text);

    renderTodos(curentUser ? todos.filter((todo) => todo.userId === curentUser.id) : todos);
}

function searchTodo (value) {
    const filteredTodo = curentUser 
        ? todos.filter((todo) => todo.text.includes(value) && todo.userId === curentUser.id)
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
            curentUser = users[i];
            clearCurentUserButton.disabled = false;

            //щоб не було декільув видшдених кнопок, спочатку чистемо усі кнопки
            userButtons.forEach((btn) => btn.classList.remove("active-user-button"));

            //якщо натиснули на кнопку, то так денамічно добавляємо тегу ще один клас 
            event.target.classList.add("active-user-button");

            const todosOfCurentUser = todos.filter((todo) => todo.userId === curentUser.id)
            renderTodos(todosOfCurentUser);
        }
    });
}

clearCurentUserButton.disabled = true;

clearCurentUserButton.onclick = () => {
    curentUser = undefined;
    renderTodos(todos);
}

searchTodoInput.oninput = () => {
    console.log(searchTodoInput.value);
    searchTodo(searchTodoInput.value)
}


