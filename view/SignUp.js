const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');


document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '') {
        alert('Please enter all details');
    } else {
        const SignupDetails = {
            Name: e.target.name.value.trim(),
            Email: e.target.email.value.trim(),
            Password: e.target.password.value,
        };
        clearInput();
        try {
            const response = await axios.post('http://localhost:5001/user/SignUp', SignupDetails)
            console.log(response);
            if (response.status === 201) {
                window.location.href="./signin.html"
            } else {
                alert('Email is already registered.');
            }

        } catch (error) {
            console.log(error);
            alert('failed to Register.email might be already registered');
        }
    }
});


function clearInput() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}


