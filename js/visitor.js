let generatedOTP = null;

async function sendOTP() {
    const phone = document.getElementById('phone').value;
    if (!phone) {
        alert('Please enter a phone number');
        return;
    }

    // Generate a random 4-digit OTP
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    try {
        await verifyPhone(phone, generatedOTP);
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('sendOtpBtn').disabled = true;
        alert(`OTP sent to your phone ${generatedOTP}`);
    } catch (error) {
        console.log(error);
        alert('Error sending OTP');
    }
}

async function verifyPhone(phone, otp) {
    const url = `${CONFIG.SCRIPT_URL}/verifyPhone`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`
        },
        body: JSON.stringify({ phone, otp })
    };
    return request(url, options);
}

async function verifyOTP() {
    const phone = document.getElementById('phone').value;
    const otp = document.getElementById('otp').value;

    if (otp !== generatedOTP) {
        alert('Invalid OTP entered');
        return;
    }
    showNewUserForm(phone);
    // TODO: Add check for new user or existing user

    // try {
    //     const response = await verifyOTP(phone, otp);
    //     if (response.isNewUser) {
    //         showNewUserForm(phone);
    //     } else {
    //         showCategorySelection();
    //     }
    // } catch (error) {
    //     alert('Error verifying OTP');
    // }
}

function showNewUserForm(phone) {
    document.getElementById('visitorFlow').style.display = 'none';
    document.getElementById('newUserForm').style.display = 'block';
    document.getElementById('registeredPhone').value = phone;
}

function showCategorySelection() {
    document.getElementById('visitorFlow').style.display = 'none';
    document.getElementById('categorySelection').style.display = 'block';
}

document.getElementById('category').addEventListener('change', function() {
    const subcategoryDiv = document.getElementById('caseSubcategory');
    subcategoryDiv.style.display = this.value === 'case' ? 'block' : 'none';
});

async function saveCategory() {
    const category = document.getElementById('category').value;
    const subcategory = category === 'case' ? document.getElementById('subcategory').value : null;

    const visitorData = {
        category,
        subcategory,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await saveVisitor(visitorData);
        currentVisit.visitors.push(response.uid);
        showAdditionalVisitors();
    } catch (error) {
        alert('Error saving category');
    }
}

async function completeVisit() {
    try {
        const response = await saveVisit({
            visitors: currentVisit.visitors,
            timestamp: new Date().toISOString()
        });
        
        currentVisit = {
            visitors: [],
            visitId: null
        };
        
        alert('Visit completed successfully!');
        window.location.reload();
    } catch (error) {
        alert('Error completing visit');
    }
}

async function submitNewUser() {
    const phone = document.getElementById('registeredPhone').value;
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const state = document.getElementById('state').value;
    const referrer = document.getElementById('referrer').value;

    // if (!phone || !name || !email) {
    //     alert('Please fill in all fields');
    //     return;
    // }

    const userData = {
        phone,
        name,
        email,
        state,
        referrer
    };

    console.log(userData);

    const url = `https://script.google.com/macros/s/AKfycbzjGMGlhWeq27WbrrX5wj41D4Df0RSrdCR2dnuojJCVne7UvdcLHBcP5TnudVwU7lROoA/exec?function=doPost`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    try {
        const response = await makeRequest(url, 'POST', userData, headers);
        if (response.success) {
            alert('New user submitted successfully!');
        } else {
            console.log(response);
            alert('Error submitting new user');
        }
    } catch (error) {
        alert('Error submitting new user');
        console.error(error);
    }
}


