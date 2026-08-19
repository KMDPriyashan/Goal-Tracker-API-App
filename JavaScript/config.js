//base url creation
const API_base_url = 'https://localhost/api/GoalTracker';

//common headers
const headers = {
    'Content-type': 'application/json'
};

//get stored userdata
function getCurrentUser (){
    try{
        const userData = sessionStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;

    }catch(error){
        return null;
    }
}

//get userid 
function getUserID (){
    const user = getCurrentUser();
    return user ? (user.id || user.userID) : null;
}

//genatic api request function
async function apiRequest(endpoint, method = 'GET', body = null){
    const url = `${API_base_url}${endpoint}`;

    const options = {
        method: method,
        headers: {...headers}
    };

    if(body){
        options.body = JSON.stringify(body);
    }

    try {
        const responce = await fetch(url, options);
        const data = await responce.json();
        return data;

    } catch (error) {
        console.error('API request error', error);
        return {
            Request: false,
            message: 'Network error. Please check your connection..! '
        };
        
    }

}
