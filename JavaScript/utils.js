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