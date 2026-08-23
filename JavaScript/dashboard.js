// Load dashboard data
async function loadDashboard() {
    const userId = getUserId();
    if (!userId) {
        showAlert('danger', 'User not found. Please login again.');
        return;
    }

    const result = await apiRequest(`/dashboard?userId=${userId}`);
    
    if (result.result === true && result.data) {
        updateDashboardStats(result.data);
    } else {
        showAlert('danger', result.message || 'Failed to load dashboard data!');
    }
}

// Update dashboard statistics
function updateDashboardStats(data) {
    const totalGoals = data.totalGoals || 0;
    const completedGoals = data.completedGoals || 0;
    const totalTasks = data.totalTasks || 0;
    const pendingTasks = data.pendingTasks || 0;

    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('completedGoals').textContent = completedGoals;
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;

    // Calculate progress
    const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    document.getElementById('goalProgress').textContent = `${progress}% Complete`;
}

// Load recent activity
async function loadRecentActivity() {
    const userId = getUserId();
    if (!userId) return;

    const result = await apiRequest(`/recent-activity?userId=${userId}`);
    
    const container = document.getElementById('activityContainer');
    
    if (result.result === true && result.data && result.data.length > 0) {
        displayActivity(result.data, container);
    } else {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-clock-history fs-1"></i>
                <p class="mt-2">No recent activity</p>
            </div>
        `;
    }
}

// Display activity
function displayActivity(activities, container) {
    const activityMap = {
        'goal_created': { icon: '🎯', color: 'text-primary' },
        'goal_updated': { icon: '✏️', color: 'text-warning' },
        'goal_deleted': { icon: '🗑️', color: 'text-danger' },
        'task_created': { icon: '✅', color: 'text-success' },
        'task_completed': { icon: '🎉', color: 'text-success' },
        'task_deleted': { icon: '🗑️', color: 'text-danger' },
        'reminder_created': { icon: '🔔', color: 'text-warning' }
    };

    const activityHtml = activities.slice(0, 10).map(activity => {
        const meta = activityMap[activity.type] || { icon: '📝', color: 'text-secondary' };
        return `
            <div class="d-flex align-items-start mb-3 pb-2 border-bottom">
                <span class="fs-4 me-3">${meta.icon}</span>
                <div>
                    <p class="mb-0 ${meta.color}">${escapeHtml(activity.description)}</p>
                    <small class="text-muted">${formatDateTime(activity.timestamp)}</small>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = activityHtml;
}