const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

document.getElementById('signUpForm').addEventListener('submit', async(e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '') {
        alert('Please enter all details');
    } else {
        const user = {
            Name: e.target.name.value.trim(),
            Email:  e.target.email.value.trim(),
            Password:  e.target.password.value,
        };
        // if(!validatePassword(user.Password)){
        //     alert("password must be combination of numbers ,special character,uppercase and lowercase")
        // }

        try {
            await axios.post('http://localhost:5000/users',user)
            clearInput();
        } catch (error) {
            console.log(error);
        }
        console.log(user);


    }
});


function clearInput(){
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}

// function validatePassword(passowrd){
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//     return passwordRegex.test(password);
// }

