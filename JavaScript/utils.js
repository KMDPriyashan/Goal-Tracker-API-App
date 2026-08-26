//logout user

function logoutUser(){
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showAlert(type, message){
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        return;
    }

    alertContainer.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

function isLoggedIn(){
    return getCurrentUser() !== null;
}

//check connection authentication status
function checkAuth (){
    if(!isLoggedIn()){
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function truncateText(text, length){
    return text && text.length > length ? `${text.slice(0, length)}...` : (text || '');
}

function formatDate(value){
    if (!value) return 'Not set';
    return new Date(value).toLocaleDateString();
}

function formatDateTime(value){
    if (!value) return 'Not set';
    return new Date(value).toLocaleString();
}

function getStatusBadgeClass(status){
    return status === 'Completed' ? 'success' : 'primary';
}

function getFrequencyBadgeClass(frequency){
    return frequency === 'Daily' ? 'info' : frequency === 'Monthly' ? 'warning' : 'secondary';
}

function confirmAction(message){
    return window.confirm(message);
}