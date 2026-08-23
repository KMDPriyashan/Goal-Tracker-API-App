//register new user
async function registerUser(userData) {
    const result = await apiRequest('/register', 'POST', userData);

    if (result.result === true) {
        showAlert('success', 'registration successfully please login');
    } else {
        showAlert('danger', result.message || 'registration failed !');
    }

    return result;
}

//login user
async function loginUser(credentials) {
    const result = await apiRequest('/login', 'POST', credentials);

    if (result.result === true) {
        sessionStorage.setItem('user', JSON.stringify(result.data));
        showAlert('success', 'login Successful;ly...');
    } else {
        showAlert('danger', result.message || 'login failed');
    }
    return result;
}

//logout user
function logoutUser() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Check authentication status
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}