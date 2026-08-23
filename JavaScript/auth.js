//register new user
async function registerUser(userData){
    const result = await apiRequest('/register', 'POST', userData);

    if(result.result === true){
        showAlert('success', 'registration successfully please login');
    }else{
        showAlert('danger', result.message || 'registration failed !');
    }

    return result;
}

//login user
