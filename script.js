document.addEventListener('DOMContentLoaded', () => {
   const taskInput = document.getElementById('taskInput');
   const addTaskBtn = document.getElementById('addTaskBtn');
   const taskList = document.getElementById('taskList');
   const clearAllBtn = document.getElementById('clearAllBtn');

   // --- Global tasks array ---
   let tasks = [];

   // --- Load tasks from Local Storage ---
   function loadTasks() {
       const storedTasks = localStorage.getItem('tasks');
       if (storedTasks) {
           tasks = JSON.parse(storedTasks);
       }
       renderTasks();
       updateClearAllButtonState();
   }

   // --- Save tasks to Local Storage ---
   function saveTasks() {
       localStorage.setItem('tasks', JSON.stringify(tasks));
       updateClearAllButtonState();
   }

   // --- Render tasks to the DOM ---
   function renderTasks() {
       taskList.innerHTML = ''; // Clear existing tasks

       if (tasks.length === 0) {
           const emptyMessage = document.createElement('li');
           emptyMessage.textContent = "No tasks yet. Add one!";
           emptyMessage.style.textAlign = "center";
           emptyMessage.style.color = "#888";
           taskList.appendChild(emptyMessage);
           return;
       }

       tasks.forEach((task, index) => {
           const li = document.createElement('li');
           li.dataset.index = index; // Store index for easier manipulation
           if (task.completed) {
               li.classList.add('completed');
           }

           const taskTextSpan = document.createElement('span');
           taskTextSpan.textContent = task.text;
           taskTextSpan.addEventListener('click', () => toggleComplete(index)); // Toggle on text click

           const actionsDiv = document.createElement('div');
           actionsDiv.classList.add('task-actions');

           const completeBtn = document.createElement('button');
           completeBtn.classList.add('complete-btn');
           completeBtn.innerHTML = task.completed ? '✕' : '✓'; // Cross or Checkmark
           completeBtn.title = task.completed ? "Mark as Incomplete" : "Mark as Complete";
           completeBtn.addEventListener('click', () => toggleComplete(index));

           const deleteBtn = document.createElement('button');
           deleteBtn.classList.add('delete-btn');
           deleteBtn.innerHTML = ''; // Trash can icon
           deleteBtn.title = "Delete Task";
           deleteBtn.addEventListener('click', () => deleteTask(index));

           actionsDiv.appendChild(completeBtn);
           actionsDiv.appendChild(deleteBtn);

           li.appendChild(taskTextSpan);
           li.appendChild(actionsDiv);
           taskList.appendChild(li);
       });
   }

   // --- Add a new task ---
   function addTask() {
       const taskText = taskInput.value.trim();
       if (taskText === '') {
           alert("Please enter a task!");
           return;
       }

       tasks.push({ text: taskText, completed: false });
       taskInput.value = ''; // Clear input field
       saveTasks();
       renderTasks();
       taskInput.focus(); // Focus back on input
   }

   // --- Toggle task completion ---
   function toggleComplete(index) {
       if (tasks[index]) {
           tasks[index].completed = !tasks[index].completed;
           saveTasks();
           renderTasks();
       }
   }

   // --- Delete a task ---
   function deleteTask(index) {
       if (confirm("Are you sure you want to delete this task?")) {
           tasks.splice(index, 1); // Remove task from array
           saveTasks();
           renderTasks();
       }
   }

   // --- Clear all tasks ---
   function clearAllTasks() {
       if (tasks.length === 0) {
           alert("No tasks to clear!");
           return;
       }
       if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
           tasks = [];
           saveTasks();
           renderTasks();
       }
   }
   
   // --- Update Clear All Button State ---
   function updateClearAllButtonState() {
       if (tasks.length > 0) {
           clearAllBtn.disabled = false;
       } else {
           clearAllBtn.disabled = true;
       }
   }


   // --- Event Listeners ---
   addTaskBtn.addEventListener('click', addTask);
   taskInput.addEventListener('keypress', (event) => {
       if (event.key === 'Enter') {
           addTask();
       }
   });
   clearAllBtn.addEventListener('click', clearAllTasks);

   // --- Initial Load ---
   loadTasks();
});