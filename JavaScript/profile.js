function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('userId').value = user.id || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';

    const userId = getUserId();
    document.getElementById('statGoals').textContent = readCollection('goals').filter(goal => goal.userId === userId).length;
    document.getElementById('statTasks').textContent = readCollection('tasks').filter(task => task.userId === userId).length;
    document.getElementById('statReminders').textContent = readCollection('reminders').filter(reminder => reminder.userId === userId).length;
}
