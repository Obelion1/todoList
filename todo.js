console.log("todo.js loaded");

const apiUrl = 'todo-api.php';
const message = document.getElementById("message");
const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const updateForm = document.getElementById('updateForm');
const updateButton = document.getElementById('updateButton');


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

// Create done button
function getDoneButton(item) {
    const doneButton = document.createElement('button');
    doneButton.textContent = 'Erledigt';

    doneButton.addEventListener('click', function () {
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: item.id, completed: !item.completed })
        })
        .then(response => response.json())
        .then((result) => {
            console.log("Completed:", result);
            fetchTodos();
        });
    });

    return doneButton;
} 

// Create update button
function getUpdateButton(item) {
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Ändern';

    updateButton.addEventListener('click', function () {
        const updateForm = document.getElementById('updateForm');
        const updateInput = document.getElementById('updateInput');

        updateInput.value = item.text;
        updateForm.dataset.todoId = item.id;
        updateForm.style.display = 'block';

    });

    return updateButton;
}
// update item name
updateForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = updateForm.dataset.todoId;
    const newText = updateInput.value;

    fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, text: newText })
    })
    .then(response => response.json())
    .then(result => {
        console.log("Updated:", result);
        updateForm.style.display = 'none';  // hide form again
        fetchTodos();                       // reload updated list
    });
});
// Fetch and display all todos
function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = '';

            todos.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.text;
                if (todo.completed) {
                    li.style.textDecoration = 'line-through';
                }
                li.appendChild(getDeleteButton(todo));
                li.appendChild(getDoneButton(todo));
                li.appendChild(getUpdateButton(todo));
                todoList.appendChild(li);
            });
        });
}

// Initial load
window.addEventListener("load", fetchTodos);
