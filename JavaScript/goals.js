//start the developmenet 

// js/goals.js

// Load all goals
async function loadAllGoals() {
    const userId = getUserId();
    if (!userId) {
        showAlert('danger', 'User not found. Please login again.');
        return;
    }

    const result = await apiRequest(`/getAllGoalsByUser?userId=${userId}`);
    
    if (result.result === true && result.data) {
        displayGoals(result.data);
    } else {
        const container = document.getElementById('goalsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="empty-state">
                        <div class="empty-icon">🎯</div>
                        <h5>No goals found</h5>
                        <p class="text-muted">Start by creating your first goal!</p>
                        <a href="add-goal.html" class="btn btn-primary">Create Goal</a>
                    </div>
                </div>
            `;
        }
    }
}

// Display goals
function displayGoals(goals) {
    const container = document.getElementById('goalsContainer');
    if (!container) return;

    if (!goals || goals.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <h5>No goals found</h5>
                    <p class="text-muted">Start by creating your first goal!</p>
                    <a href="add-goal.html" class="btn btn-primary">Create Goal</a>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="col-md-4 col-sm-6">
            <div class="card goal-card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${escapeHtml(goal.goalName)}</h5>
                        <span class="badge bg-${getStatusBadgeClass(goal.status)} goal-status-badge">
                            ${goal.status || 'Active'}
                        </span>
                    </div>
                    <p class="card-text text-muted small">
                        ${escapeHtml(truncateText(goal.description || 'No description', 80))}
                    </p>
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${formatDate(goal.targetDate)}
                        </small>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="bi bi-list-check"></i> ${goal.milestones ? goal.milestones.length : 0} milestones
                        </small>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex gap-1">
                    <a href="goal-detail.html?id=${goal.id}" class="btn btn-sm btn-outline-primary flex-grow-1">
                        <i class="bi bi-eye"></i> View
                    </a>
                    <a href="edit-goal.html?id=${goal.id}" class="btn btn-sm btn-outline-warning">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button onclick="deleteGoal(${goal.id})" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Create goal
async function createGoal(goalData) {
    const result = await apiRequest('/createGoalWithMilestones', 'POST', goalData);
    
    if (result.result === true) {
        showAlert('success', 'Goal created successfully!');
    } else {
        showAlert('danger', result.message || 'Failed to create goal!');
    }
    
    return result;
}

// Load goal for editing
async function loadGoalForEdit(goalId) {
    const result = await apiRequest(`/getGoal/${goalId}`);
    
    if (result.result === true && result.data) {
        populateEditForm(result.data);
    } else {
        showAlert('danger', result.message || 'Failed to load goal data!');
        setTimeout(() => window.location.href = 'goals.html', 2000);
    }
}

// Populate edit form
function populateEditForm(goal) {
    document.getElementById('goalId').value = goal.id;
    document.getElementById('goalName').value = goal.goalName || '';
    document.getElementById('description').value = goal.description || '';
    if (goal.targetDate) {
        document.getElementById('targetDate').value = goal.targetDate.split('T')[0];
    }

    const container = document.getElementById('milestonesContainer');
    container.innerHTML = '';

    if (goal.milestones && goal.milestones.length > 0) {
        goal.milestones.forEach(milestone => {
            const div = document.createElement('div');
            div.className = 'milestone-item border p-3 rounded mb-2';
            div.innerHTML = `
                <div class="row">
                    <div class="col-md-5">
                        <input type="text" class="form-control form-control-sm milestone-name" value="${escapeHtml(milestone.milestoneName)}" placeholder="Milestone name" required>
                        <input type="hidden" class="milestone-id" value="${milestone.id || 0}">
                    </div>
                    <div class="col-md-5">
                        <input type="date" class="form-control form-control-sm milestone-date" value="${milestone.dueDate ? milestone.dueDate.split('T')[0] : ''}" placeholder="Due date">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger btn-sm remove-milestone">✕</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
            
            div.querySelector('.remove-milestone').addEventListener('click', function() {
                if (document.querySelectorAll('.milestone-item').length > 1) {
                    this.closest('.milestone-item').remove();
                } else {
                    showAlert('warning', 'You need at least one milestone');
                }
            });
        });
    } else {
        // Add default milestone
        const div = document.createElement('div');
        div.className = 'milestone-item border p-3 rounded mb-2';
        div.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <input type="text" class="form-control form-control-sm milestone-name" placeholder="Milestone name" required>
                    <input type="hidden" class="milestone-id" value="0">
                </div>
                <div class="col-md-5">
                    <input type="date" class="form-control form-control-sm milestone-date" placeholder="Due date">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger btn-sm remove-milestone">✕</button>
                </div>
            </div>
        `;
        container.appendChild(div);
        
        div.querySelector('.remove-milestone').addEventListener('click', function() {
            showAlert('warning', 'You need at least one milestone');
        });
    }
}

// Update goal
async function updateGoal(goalId, goalData) {
    const result = await apiRequest(`/updateGoalWithMilestones/${goalId}`, 'PUT', goalData);
    
    if (result.result === true) {
        showAlert('success', 'Goal updated successfully!');
    } else {
        showAlert('danger', result.message || 'Failed to update goal!');
    }
    
    return result;
}

// Delete goal
async function deleteGoal(goalId) {
    if (!confirmAction('Are you sure you want to delete this goal?')) return;

    const result = await apiRequest(`/deleteGoal/${goalId}`, 'DELETE');
    
    if (result.result === true) {
        showAlert('success', 'Goal deleted successfully!');
        loadAllGoals();
    } else {
        showAlert('danger', result.message || 'Failed to delete goal!');
    }
}

// Load goal detail
async function loadGoalDetail(goalId) {
    const result = await apiRequest(`/getGoal/${goalId}`);
    
    const container = document.getElementById('goalDetailContainer');
    
    if (result.result === true && result.data) {
        displayGoalDetail(result.data, container);
    } else {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h5>Goal not found</h5>
                    <p class="text-muted">${result.message || 'The goal you are looking for does not exist.'}</p>
                    <a href="goals.html" class="btn btn-primary">Back to Goals</a>
                </div>
            </div>
        `;
    }
}

// Display goal detail
function displayGoalDetail(goal, container) {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-8 mx-auto">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h3>${escapeHtml(goal.goalName)}</h3>
                            <span class="badge bg-${getStatusBadgeClass(goal.status)} goal-status-badge fs-6">
                                ${goal.status || 'Active'}
                            </span>
                        </div>
                        <p class="text-muted">${escapeHtml(goal.description || 'No description')}</p>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <small class="text-muted"><strong>Target Date:</strong> ${formatDate(goal.targetDate)}</small>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted"><strong>Created:</strong> ${formatDate(goal.createdDate)}</small>
                            </div>
                        </div>
                        
                        <hr>
                        <h5 class="mb-3">📌 Milestones (${goal.milestones ? goal.milestones.length : 0})</h5>
                        ${goal.milestones && goal.milestones.length > 0 ? 
                            goal.milestones.map(m => `
                                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                                    <div>
                                        <i class="bi bi-${m.isCompleted ? 'check-circle-fill text-success' : 'circle'}"></i>
                                        ${escapeHtml(m.milestoneName)}
                                    </div>
                                    <small class="text-muted">${formatDate(m.dueDate)}</small>
                                </div>
                            `).join('') :
                            '<p class="text-muted">No milestones added yet.</p>'
                        }
                        
                        <div class="d-flex gap-2 mt-4">
                            <a href="edit-goal.html?id=${goal.id}" class="btn btn-warning">
                                <i class="bi bi-pencil"></i> Edit
                            </a>
                            <button onclick="deleteGoal(${goal.id})" class="btn btn-danger">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                            <a href="goals.html" class="btn btn-outline-secondary ms-auto">
                                <i class="bi bi-arrow-left"></i> Back
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Filter goals (search + status)
function filterGoals(searchTerm = '', status = 'all') {
    const container = document.getElementById('goalsContainer');
    if (!container) return;

    const cards = container.querySelectorAll('.col-md-4, .col-sm-6');
    const searchLower = searchTerm.toLowerCase();

    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
        const desc = card.querySelector('.card-text')?.textContent?.toLowerCase() || '';
        const badge = card.querySelector('.goal-status-badge')?.textContent?.toLowerCase() || '';
        
        const matchesSearch = title.includes(searchLower) || desc.includes(searchLower);
        const matchesStatus = status === 'all' || badge.includes(status.toLowerCase());
        
        card.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}