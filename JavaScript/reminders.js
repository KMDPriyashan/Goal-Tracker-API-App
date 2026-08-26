// Load all reminders
async function loadAllReminders() {
    const userId = getUserId();
    if (!userId) {
        showAlert('danger', 'User not found. Please login again.');
        return;
    }

    displayReminders(readCollection('reminders').filter(reminder => reminder.userId === userId));
}

// Display reminders
function displayReminders(reminders) {
    const container = document.getElementById('remindersContainer');
    if (!container) return;

    if (!reminders || reminders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="empty-state">
                    <div class="empty-icon">🔔</div>
                    <h5>No reminders set</h5>
                    <p class="text-muted">Set a reminder to never miss anything important!</p>
                    <a href="add-reminder.html" class="btn btn-warning">Set Reminder</a>
                </div>
            </div>
        `;
        return;
    }

    // Sort by date (upcoming first)
    reminders.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));

    container.innerHTML = reminders.map(reminder => {
        const reminderDate = new Date(reminder.reminderDate);
        const now = new Date();
        const isPast = reminderDate < now;
        
        return `
            <div class="list-group-item d-flex justify-content-between align-items-center 
                        ${isPast ? 'bg-light' : 'border-start border-warning border-4'}">
                <div>
                    <h6 class="mb-1 ${isPast ? 'text-muted' : ''}">
                        ${escapeHtml(reminder.reminderText)}
                    </h6>
                    <small class="${isPast ? 'text-muted' : 'text-warning'}">
                        <i class="bi bi-clock"></i> 
                        ${formatDateTime(reminder.reminderDate)}
                        ${isPast ? ' (Past)' : ''}
                    </small>
                </div>
                <button onclick="deleteReminder(${reminder.id})" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Create reminder
async function createReminder(reminderData) {
    const reminders = readCollection('reminders');
    const reminder = { ...reminderData, id: Date.now() };
    reminders.push(reminder);
    writeCollection('reminders', reminders);
    const result = localResult(reminder);
    showAlert('success', 'Reminder set successfully!');
    return result;
}

// Delete reminder
async function deleteReminder(reminderId) {
    if (!confirmAction('Are you sure you want to delete this reminder?')) return;

    const reminders = readCollection('reminders').filter(reminder => String(reminder.id) !== String(reminderId));
    writeCollection('reminders', reminders);
    showAlert('success', 'Reminder deleted successfully!');
    loadAllReminders();
}