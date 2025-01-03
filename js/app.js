const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");
const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
/* time elements */
const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");
const closeEl = document.getElementById("close");

// check
let todos = JSON.parse(localStorage.getItem("list")) || [];

if(todos.length) showTodos();

// setTodos to localStorage
function setTodos() {
    localStorage.setItem('list', JSON.stringify(todos));
}

// time
function getTime() {
    const now = new Date();
    const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    const month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1; // Fixing month index
    const year = now.getFullYear();
    const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

    fullDay.textContent = `${date}.${month}.${year}`;
    hourEl.textContent = `${hour}`;
    minuteEl.textContent = `${minute}`;
    secondEl.textContent = `${second}`;

    return `${hour}:${minute}, ${date}.${month}.${year}`;
}

// Auto-update time every second
setInterval(getTime, 1000);

// Show Todos
function showTodos() {
    listGroupTodo.innerHTML = '';
    todos.forEach((item, i) => {
        listGroupTodo.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            ${item.text}
            <div class="todo-icons">
                <span class="opacity-50 me-2">${item.time}</span> 
                <img src="img/edit.svg" alt="edit icon" width="25" height="25" class="edit-icon" data-index="${i}">
                <img src="img/delete.svg" alt="delete icon" width="25" height="25" class="delete-icon" data-index="${i}">
            </div>
        </li>
        `;
    });

    // Add event listeners for edit and delete icons
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', editTodo);
    });

    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', deleteTodo);
    });
}

// Show error message
function showMessage(where, message) {
    document.getElementById(`${where}`).textContent = message;

    setTimeout(() => {
        document.getElementById(`${where}`).textContent = '';
    }, 2500);
}

// Edit Todo
function editTodo(e) {
    const index = e.target.getAttribute('data-index');
    const todo = todos[index];
    
    // Set the value in the edit form and show the modal for editing
    formEdit['input-edit'].value = todo.text; // Assuming you have an input with the name 'input-edit'
    showModal(); // Show the modal

    formEdit.onsubmit = (e) => {
        e.preventDefault();
        const updatedText = formEdit['input-edit'].value.trim();

        if (updatedText.length) {
            todos[index].text = updatedText;
            todos[index].time = getTime(); // Update the time when editing
            setTodos();
            showTodos();
            modal.style.display = 'none'; // Close the modal
            overlay.style.display = 'none'; // Close the overlay
        } else {
            showMessage('message-edit', 'This field is required');
        }
    };
}

// Delete Todo
function deleteTodo(e) {
    const index = e.target.getAttribute('data-index');
    todos.splice(index, 1);
    setTodos();
    showTodos();
}

// Create Todo
formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoText = formCreate['input-create'].value.trim();
    formCreate.reset();

    if (todoText.length) {
        todos.push({ text: todoText, time: getTime(), completed: false });
        setTodos();
        showTodos();
    } else {
        showMessage('message-create', 'This field is required');
    }
});

// Show modal
function showModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

// Close modal when clicking outside or on overlay
overlay.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

// Close modal by clicking close button
closeEl.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});
