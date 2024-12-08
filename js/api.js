async function request(url, options) {
    // const response = await fetch(url, options);
    // if (!response.ok) {
    //     throw new Error('Network response was not ok');
    // }
    // return response.json();

    // TODO: Uncomment after testing
    return {
        status: 200,
        json: async () => ({ message: 'Mock response' })
    };
}


async function makeRequest(url, method, data, headers = {}) {
    url = `${CONFIG.SCRIPT_URL}${url}`
    const options = {
        redirect: 'follow',
        method: method,
        headers: headers,
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
    }
    return response.json();
}

async function verifyPhone(phone) {
    const url = `${CONFIG.SCRIPT_URL}/verifyPhone`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
        },
        body: JSON.stringify({ phone })
    };
    return request(url, options);
}

async function saveVisitor(visitorData) {
    const url = `${CONFIG.SCRIPT_URL}/saveVisitor`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
        },
        body: JSON.stringify(visitorData)
    };
    return request(url, options);
}

async function saveVisit(visitData) {
    const url = `${CONFIG.SCRIPT_URL}/saveVisit`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
        },
        body: JSON.stringify(visitData)
    };
    return request(url, options);
}

async function _submitNewUser(userData) {
    const url = `${CONFIG.SCRIPT_URL}/submitNewUser`;
    const photoPreview = document.getElementById('photoPreview');
    userData.image = photoPreview.src
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
        },
        body: JSON.stringify(userData)
    };

    return request(url, options);
}