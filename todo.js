console.log("todo.js loaded");

const apiUrl = 'todo-api.php';
const message = document.getElementById("message");
const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// Handle form submit
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const todoInput = input.value.trim();

    // validation
    if (todoInput === "") {
        message.textContent = "ERROR input empty: nothing added";
        message.style.visibility = "visible";

        setTimeout(() => {
            message.textContent = "";
        }, 3000);
        return;
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: todoInput }),
    })
    .then(response => response.json())
    .then((data) => {
        console.log("Added:", data);
        fetchTodos(); // reload list
        input.value = '';
    });
});

// Create delete button
function getDeleteButton(item) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';

    deleteButton.addEventListener('click', function () {
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: item.id })
        })
        .then(response => response.json())
        .then((result) => {
            console.log("Deleted:", result);
            fetchTodos();
        });
    });

    return deleteButton;
}

// Fetch and display all todos
function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = '';

            todos.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.text; // FIXED: show text instead of [object Object]
                li.appendChild(getDeleteButton(todo));
                todoList.appendChild(li);
            });
        });
}

// Initial load
window.addEventListener("load", fetchTodos);
