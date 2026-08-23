// js/tasks.js

let allTasks = [];

// Load all tasks
async function loadAllTasks() {
    const userId = getUserId();
    if (!userId) {
        showAlert('danger', 'User not found. Please login again.');
        return;
    }

    const result = await apiRequest(`/getAllTasks?userId=${userId}`);
    
    if (result.result === true && result.data) {
        allTasks = result.data;
        displayTasks(allTasks);
    } else {
        const container = document.getElementById('tasksContainer');
        if (container) {
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
        }
    }
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
    const result = await apiRequest('/createTask', 'POST', taskData);
    
    if (result.result === true) {
        showAlert('success', 'Task created successfully!');
    } else {
        showAlert('danger', result.message || 'Failed to create task!');
    }
    
    return result;
}

// Load task for editing
async function loadTaskForEdit(taskId) {
    const result = await apiRequest(`/getTask/${taskId}`);
    
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
    const result = await apiRequest(`/updateTask/${taskId}`, 'PUT', taskData);
    
    if (result.result === true) {
        showAlert('success', 'Task updated successfully!');
    } else {
        showAlert('danger', result.message || 'Failed to update task!');
    }
    
    return result;
}

// Delete task
async function deleteTask(taskId) {
    if (!confirmAction('Are you sure you want to delete this task?')) return;

    const result = await apiRequest(`/deleteTask/${taskId}`, 'DELETE');
    
    if (result.result === true) {
        showAlert('success', 'Task deleted successfully!');
        loadAllTasks();
    } else {
        showAlert('danger', result.message || 'Failed to delete task!');
    }
}

// Mark task as complete
async function markTaskComplete(taskId) {
    const result = await apiRequest('/complete', 'POST', {
        taskId: taskId,
        userId: parseInt(getUserId())
    });
    
    if (result.result === true) {
        showAlert('success', 'Task marked as complete! 🎉');
        loadAllTasks();
    } else {
        showAlert('danger', result.message || 'Failed to complete task!');
    }
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