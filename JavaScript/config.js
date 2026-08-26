//base url creation
const API_BASE_URL = 'http://localhost:5500/api/GoalTracker';

//common headers
const headers = {
    'Content-type': 'application/json'
};

const STORAGE_KEYS = {
    goals: 'goals',
    tasks: 'tasks',
    reminders: 'reminders'
};

function readCollection(collection) {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS[collection]) || '[]');
    } catch (error) {
        return [];
    }
}

function writeCollection(collection, items) {
    localStorage.setItem(STORAGE_KEYS[collection], JSON.stringify(items));
}

function localResult(data) {
    return { result: true, data: data };
}

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
function getUserId (){
    const user = getCurrentUser();
    return user ? (user.id || user.userID) : null;
}

//genatic api request function
async function apiRequest(endpoint, method = 'GET', body = null){
    const url = `${API_BASE_URL}${endpoint}`;

    const options = {
        method: method,
        headers: {...headers}
    };

    if(body){
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const responseText = await response.text();
        let data = {};

        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (error) {
            data = {};
        }

        if (!response.ok) {
            return {
                result: false,
                message: data.message || `API request failed (${response.status})`
            };
        }

        return data;

    } catch (error) {
        console.error('API request error', error);
        return {
            result: false,
            message: 'The API blocked this request. Enable CORS on the backend or serve this frontend from the same origin as the API.'
        };
        
    }

}
