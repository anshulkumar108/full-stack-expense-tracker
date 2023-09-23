const email = document.getElementById('email');
const password = document.getElementById('password');
const loginForm = document.getElementById('signinForm');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const cancelResetBtn = document.getElementById('cancelResetBtn');

forgotPasswordForm.style.display = 'none';

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
        alert('Please enter all details');
    } else {
        const SigninDetails = {
            Email: e.target.email.value.trim(),
            Password: e.target.password.value,
        };
        clearInput();
        try {
            const response = await axios.post('http://44.209.180.175/signin', SigninDetails);
            const token = response.data.token;
            console.log(token)
            localStorage.setItem('accessToken', token);
            if (response.status == 201) {
                window.location.href = "./expenditure.html"
            } else if (response.status == 402) {
                alert('Wrong password')
            } else {
                alert('Wrong email ID')
            }

        } catch (error) {
            console.log(error);
        }
    }
})

function clearInput() {
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}

forgotPasswordBtn.addEventListener('click',ForgetPassword);

function ForgetPassword(){
    loginForm.style.display='none';
    forgotPasswordForm.style.display='block';
    document.getElementById('forgotPasswordBtn').style.display='none';
}

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const forgetUserDetails = {
        Email: document.getElementById('resetEmail').value,
    };
    console.log(forgetUserDetails);

    try {
        const response = await axios.post('http://44.209.180.175/api/password/forgotpassword', forgetUserDetails);
        console.log(response.data); // Handle the response data as needed
    } catch (error) {
        console.error(error);
    }
})

function showLoginForm() {
    forgotPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
    document.getElementById('forgotPasswordBtn').style.display = 'block';
}

cancelResetBtn.addEventListener('click', showLoginForm);