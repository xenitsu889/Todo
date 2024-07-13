const input = document.querySelector('.input');
const button = document.querySelector('.button');
const todoDiv = document.querySelector('.todos');
let lastDraggedTodo = null; // Track the last dragged todo

button.addEventListener('click', (event) => {
    let todo = input.value.trim();
    if (todo == '') {
        alert("Please enter something");
        return;
    }

    if (todoExist(todo)) {
        alert("Todo already exists");
        input.value = '';
        return;
    }

    const newTodo = document.createElement('div');
    newTodo.draggable = true;
    newTodo.classList.add('todo'); // Add a class for styling if needed

    const todoText = document.createElement('h3');
    todoText.textContent = todo;

    const newBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('todoBtn');

    editBtn.addEventListener('click', () => {
        let newText = prompt("Enter the new value to change");
        if (newText !== '') {
            todoText.textContent = newText;
        } else {
            alert("Please enter something");
        }
    });

    newBtn.addEventListener('click', () => {
        newTodo.remove();
    });

    newTodo.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.effectAllowed = 'move'; // Specify the operation allowed for the drag
        event.target.style.opacity = '0.5';
        lastDraggedTodo = event.target; // Store the dragged todo element
        lastDraggedTodoIndex = Array.from(todoDiv.children).indexOf(event.target); // Store the index of the dragged todo
        event.target.style.backgroundColor = 'lightblue'; // Apply a visual effect (e.g., change background color)
    });

    newTodo.addEventListener('dragend', (event) => {
        event.target.style.opacity = ''; // Reset opacity after drag ends
        event.target.style.backgroundColor = 'white'; // Apply a visual effect (e.g., change background color)
    });

    newTodo.id = 'todo-' + Date.now();
    newBtn.textContent = 'Delete';
    newBtn.classList.add('todoBtn');

    newTodo.appendChild(todoText);
    newTodo.appendChild(editBtn);
    newTodo.appendChild(newBtn);
    todoDiv.appendChild(newTodo);
    input.value = '';
});

// Handle dragover and drop events on the todoDiv itself
todoDiv.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevent default drop behavior
});

todoDiv.addEventListener('drop', (event) => {
    event.preventDefault(); // Prevent default drop behavior

    // Ensure lastDraggedTodo exists and update its text content with dropped data
    if (lastDraggedTodo) {
        const droppedIndex = Array.from(todoDiv.children).indexOf(event.target); // Get the index of the drop target

        // Reorder todos by inserting lastDraggedTodo at the dropped index
        if (droppedIndex !== -1) {
            const todos = Array.from(todoDiv.children);
            const draggedElement = todos.splice(lastDraggedTodoIndex, 1)[0];
            todos.splice(droppedIndex, 0, draggedElement);

            // Re-append todos in the new order
            todoDiv.innerHTML = ''; // Clear existing todos
            todos.forEach(todo => todoDiv.appendChild(todo));
        }

        lastDraggedTodo.style.opacity = ''; // Reset opacity of last dragged todo
        lastDraggedTodo = null; // Reset last dragged todo
    }
});

const todoExist = (todoText) => {
    let todos = todoDiv.querySelectorAll('.todo h3');
    for (let todo of todos) {
        if (todo.textContent.trim().toLowerCase() === todoText.toLowerCase()) {
            return true;
        }
    }
    return false;
};
