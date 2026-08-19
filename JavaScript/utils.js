//register new user
async function registerUser (userData){
    const result = await apiRequest('/register', 'POST', userData);
    
    if(result.result === true){
        showAlert('success', 'registration succefull ! please login.')
    }else{
        showAlert('danger', result.message || 'registration failded..!');
    }
    return result;
}

//login user
async function loginUser (credintials) {
    const result = await apiRequest('/login', 'POST', credintials);
    if(result.result === true){
        sessionStorage.setItem('user', JSON.stringify(result.data));
        showAlert('success', 'login successfull..!');
    }else{
        showAlert('danger', result.message || 'login failed..!');
    }
    return result;

}

//logout user

function logoutUser(){
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

//check connection authentication status
function checkAuth (){
    if(!isLoggedIn()){
        window.location.href = 'login.html';
        return false;
    }
    return true;
}