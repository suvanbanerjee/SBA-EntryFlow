let generatedOTP = null;
// Generate a random 4-digit OTP
generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

async function sendOTP() {
    const phone = document.getElementById('phone').value;
    if (!phone) {
        alert('Please enter a phone number');
        return;
    }

    const resp = await makeRequest('', 'POST', {phone: phone, action: 'sendOtp'})

    try {
        let link=`whatsapp:///send?phone=91${phone}&text=${generatedOTP}`;
        window.open(link, '_blank');
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('sendOtpBtn').disabled = true;
        document.getElementById('phoneStatus').innerHTML = resp.data.userExists? 'Visitor exists': 'Visitor does not exist'
        sessionStorage.setItem(phone, JSON.stringify({exists: resp.data.userExists}));
        alert(`OTP sent to your phone ${generatedOTP}. User exists? ${resp.data.userExists}`);
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
    const userExists = JSON.parse(sessionStorage.getItem(phone)).exists;
    if (userExists) {
        showCategorySelection()
    }
    else {
        showNewUserForm(phone);
    }
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
function hideNewUserForm(phone) {
    document.getElementById('newUserForm').style.display = 'none';
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
        phone: document.getElementById('phone').value,
        parent: document.getElementById('phone').value,
        action: 'submitVisitor'
    };

    try {
        const response = await makeRequest('', "POST", visitorData);
        // currentVisit.visitors.push(document.getElementById('phone').value);
        document.getElementById('additionalVisitors').style.display = 'block';
    } catch (error) {
        alert('Error saving category');
    }
}

async function addMoreVisitors() {
    document.getElementById('registeredPhone').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('otp').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('state').value = '';
    document.getElementById('referrer').value = '';

    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('sendOtpBtn').disabled = false;
    document.getElementById('phoneStatus').innerHTML = ''

    login()
}

async function completeVisit() {
    document.getElementById('registeredPhone').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('otp').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('state').value = '';
    document.getElementById('referrer').value = '';

    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('sendOtpBtn').disabled = false;
    document.getElementById('phoneStatus').innerHTML = ''

    login()
}

async function submitNewUser() {
    const phone = document.getElementById('registeredPhone').value;
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const state = document.getElementById('state').value;
    const referrer = document.getElementById('referrer').value;

    const newUserForm = document.getElementById('newUserForm');
    const categorySelection = document.getElementById('categorySelection');
    const additionalVisitors = document.getElementById('additionalVisitors');

    // if (!phone || !name || !email) {
    //     alert('Please fill in all fields');
    //     return;
    // }

    const userData = {
        phone,
        name,
        email,
        state,
        referrer,
        image: photoData,
        vid: Math.floor(10000 + Math.random() * 90000),
        action: 'submitNewVisitor'
    };

    // console.log(userData);


    try {
        const response = await makeRequest('', 'POST', userData);
        if (response.status === 'success') {
            alert('New user submitted successfully!');
        } else {
            console.log(response);
            alert('Error submitting new user');
        }
    } catch (error) {
        alert('Error submitting new user');
        console.error(error);
    }
    finally {
        showCategorySelection()
        hideNewUserForm(phone)
        // newUserForm.style.display = 'none';
        // categorySelection.style.display = 'none';
        // additionalVisitors.style.display = 'block';
    }
}


