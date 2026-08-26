const REGISTERED_USER_KEY = 'registeredUser';

//register new user
async function registerUser(userData) {
    const registeredUser = { ...userData, id: Date.now() };
    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(registeredUser));
    const result = { result: true, data: registeredUser };

    showAlert('success', 'Registration successful. Please login.');

    return result;
}

//login user
async function loginUser(credentials) {
    const storedUser = JSON.parse(localStorage.getItem(REGISTERED_USER_KEY) || 'null');
    const isValidUser = storedUser &&
        storedUser.username === credentials.username &&
        storedUser.password === credentials.password;

    if (!isValidUser) {
        showAlert('danger', 'Invalid username or password. Please try again.');
        document.getElementById('loginform')?.reset();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return { result: false, message: 'Invalid username or password.' };
    }

    const result = { result: true, data: storedUser };

    sessionStorage.setItem('user', JSON.stringify(result.data));
    showAlert('success', 'Login successful.');
    return result;
}

//logout user
function logoutUser() {
    sessionStorage.removeItem('user');
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
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