// js/tasks.js

let allTasks = [];

// Load all tasks
async function loadAllTasks() {
    const userId = getUserId();
    if (!userId) {
        showAlert('danger', 'User not found. Please login again.');
        return;
    }

    allTasks = readCollection('tasks').filter(task => task.userId === userId);
    displayTasks(allTasks);
}

// Display tasks
function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    if (!container) return;

    if (!tasks || tasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h5>No tasks found</h5>
                    <p class="text-muted">Create your first task to stay organized!</p>
                    <a href="add-task.html" class="btn btn-success">Create Task</a>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="list-group-item task-item ${task.isCompleted ? 'completed' : ''}">
            <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <h6 class="mb-1 ${task.isCompleted ? 'text-muted' : ''}">
                        ${escapeHtml(task.taskName)}
                    </h6>
                    <small class="text-muted">${escapeHtml(truncateText(task.description || '', 60))}</small>
                    <br>
                    <span class="badge bg-${getFrequencyBadgeClass(task.frequency)} me-1">
                        ${task.frequency || 'Weekly'}
                    </span>
                    ${task.isCompleted ? '<span class="badge bg-success">Completed ✅</span>' : ''}
                    <small class="text-muted ms-2">
                        <i class="bi bi-calendar"></i> ${formatDate(task.dueDate)}
                    </small>
                </div>
                <div class="btn-group btn-group-sm" role="group">
                    ${!task.isCompleted ? 
                        `<button onclick="markTaskComplete(${task.id})" class="btn btn-success">
                            <i class="bi bi-check2"></i>
                        </button>` : ''
                    }
                    <a href="edit-task.html?id=${task.id}" class="btn btn-warning">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button onclick="deleteTask(${task.id})" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Create task
async function createTask(taskData) {
    const tasks = readCollection('tasks');
    const task = { ...taskData, id: Date.now(), isCompleted: false };
    tasks.push(task);
    writeCollection('tasks', tasks);
    const result = localResult(task);
    showAlert('success', 'Task created successfully!');
    return result;
}

// Load task for editing
async function loadTaskForEdit(taskId) {
    const task = readCollection('tasks').find(item => String(item.id) === String(taskId));
    const result = task ? localResult(task) : { result: false, message: 'Task not found.' };
    
    if (result.result === true && result.data) {
        const task = result.data;
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskName').value = task.taskName || '';
        document.getElementById('description').value = task.description || '';
        document.getElementById('frequency').value = task.frequency || 'Weekly';
        if (task.startDate) {
            document.getElementById('startDate').value = task.startDate.split('T')[0];
        }
        if (task.dueDate) {
            document.getElementById('dueDate').value = task.dueDate.split('T')[0];
        }
        document.getElementById('isCompleted').checked = task.isCompleted || false;
    } else {
        showAlert('danger', result.message || 'Failed to load task data!');
        setTimeout(() => window.location.href = 'tasks.html', 2000);
    }
}

// Update task
async function updateTask(taskId, taskData) {
    const tasks = readCollection('tasks');
    const index = tasks.findIndex(task => String(task.id) === String(taskId));
    if (index < 0) return { result: false, message: 'Task not found.' };
    tasks[index] = { ...tasks[index], ...taskData };
    writeCollection('tasks', tasks);
    const result = localResult(tasks[index]);
    showAlert('success', 'Task updated successfully!');
    return result;
}

// Delete task
async function deleteTask(taskId) {
    if (!confirmAction('Are you sure you want to delete this task?')) return;

    const tasks = readCollection('tasks').filter(task => String(task.id) !== String(taskId));
    writeCollection('tasks', tasks);
    showAlert('success', 'Task deleted successfully!');
    loadAllTasks();
}

// Mark task as complete
async function markTaskComplete(taskId) {
    const tasks = readCollection('tasks');
    const task = tasks.find(item => String(item.id) === String(taskId));
    if (!task) return;
    task.isCompleted = true;
    writeCollection('tasks', tasks);
    showAlert('success', 'Task marked as complete! 🎉');
    loadAllTasks();
}

// Filter tasks
function filterTasks(searchTerm = '', frequency = 'all') {
    const searchLower = searchTerm.toLowerCase();
    const showCompleted = document.getElementById('showCompleted')?.textContent?.includes('Hide') || true;

    let filtered = allTasks.filter(task => {
        const matchesSearch = task.taskName.toLowerCase().includes(searchLower) ||
                             (task.description || '').toLowerCase().includes(searchLower);
        const matchesFrequency = frequency === 'all' || task.frequency === frequency;
        const matchesCompleted = showCompleted ? true : !task.isCompleted;
        
        return matchesSearch && matchesFrequency && matchesCompleted;
    });

    displayTasks(filtered);
}