
const email = document.getElementById('email');
const password = document.getElementById('password');

document.getElementById('signinForm').addEventListener('submit', async (e) => {
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
            const response = await axios.post('http://localhost:5000/users/signin', SigninDetails)
            if (response.status == 201) {
                window.location.href = "./signup.html"
                alert('login successful')
            } else {
                alert('failed to login')

            }

        } catch (error) {
            console.log(error);
            // window.location.href = "./signup.html"
          alert('user is not registered or passowrd is wrong')
        }
    

    }
})

function clearInput(){
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}