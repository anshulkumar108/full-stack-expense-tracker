
const amount = document.getElementById('Amount');
const description = document.getElementById('Description');
const category = document.getElementById('Category');


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    console.log(base64Url)
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
    // return JSON.parse(window.atob(base64));   ///this one alo work fine
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    const decodedToken = parseJwt(token)
    console.log(decodedToken)
    const isPremium = decodedToken.ispremiumUser;
    console.log(isPremium);
    if (isPremium === true) {
        checkAndDisplayPremiumMessage();
        showLeadBoard();

    }
    const response = await axios.get('http://localhost:5000/users/fetchExpenseDetails', { headers: { "Authorization": token } })
    const expensedetails = response.data.Details;
    expensedetails.forEach(expense => {
        fetchExpenseList(expense);
    });

});


function cleanInputText() {
    document.getElementById('Amount').value = '';
    document.getElementById('Description').value = '';
    document.getElementById('Category').value = '';

}

document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();

    const ExpenseDetails = {
        Amount: amount.value,
        Description: description.value,
        Category: category.value
    }
    try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.post(
            'http://localhost:5000/users/addExpense',
            ExpenseDetails,
            {
                headers: {
                    "Authorization": token
                }
            }
        );
        fetchExpenseList(response.data.PostData)
        cleanInputText();
    } catch (error) {
        console.log(error);
    }

})

async function fetchExpenseList(expensedetails) {
    try {
        console.log(expensedetails);
        const ul = document.getElementById('listOfExpense');
        const ExpenseId = expensedetails.id;
        ul.innerHTML += `<li id=${ExpenseId}>  ${expensedetails.amount} ${expensedetails.description} ${expensedetails.category} 
              <button onclick='deleteExpense(event,${ExpenseId})'>DELETE EXPENSE</button>
              </li>`
    } catch (error) {
        console.log(error)
    }
}


async function deleteExpense(event, ExpenseId) {
    let expenseElement = event.target.parentElement;
    try {
        if (ExpenseId === undefined) {
            console.log('Expense ID is missing');
            return;
        }
        const token = localStorage.getItem('accessToken');
        const response = await axios.delete(`http://localhost:5000/users/deleteExpense/${ExpenseId}`, {
            headers: {
                "Authorization": token
            }
        });
       
        if (response.status == 201) {
            expenseElement.remove();
        } else {
            alert('you are not authorized user')
        }

    } catch (error) {
        console.log(error);
    }

}

document.getElementById('Premium').addEventListener('click', async (e) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axios.get('http://localhost:5000/api/purchaseMember',
            { headers: { "Authorization": token } });
        console.log(response);
        const options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                try {
                    const res = await axios.post('http://localhost:5000/api/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, { headers: { "Authorization": token } });
                    console.log(res);
                    alert('You are a Premium User Now');
                    localStorage.setItem('isPremium', 'true');
                    checkAndDisplayPremiumMessage();
                    showLeadBoard();
                } catch (error) {
                    console.log(error);
                }
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', async function (response) {
            try {
                const res = await axios.post('http://localhost:5000/api/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_failed: true,
                }, { headers: { "Authorization": token } });

                console.log(res);
                alert('Something went wrong');
            } catch (error) {
                console.log(error);
            }
        });


    } catch (error) {
        console.log(error);
    }
});

function checkAndDisplayPremiumMessage() {
    document.getElementById('Premium').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = "You are a premium user";
};

async function showLeadBoard() {
    const leaderBoard = document.createElement('button')
    leaderBoard.id = "board"
    leaderBoard.innerText = "Show LeaderBoard";
    document.getElementById('message').appendChild(leaderBoard);

    let leaderboardShown = false;

    leaderBoard.onclick =async (e) => {
        e.preventDefault();
        if (!leaderboardShown) { // Check if the leaderboard is not already shown
        const token = localStorage.getItem('accessToken');
        try {
            const h3=document.createElement('h3')
            h3.innerText=' Expense leadBoard of all Users'
            document.getElementById('LeaderBoard').appendChild(h3)

            const li=document.createElement('li');

            const response = await axios.get('http://localhost:5000/api/premium/usersLeaderBoard', 
            { headers: { "Authorization": token } })
            const listOfUsers=response.data;
            listOfUsers.forEach(element => {
                li.innerHTML+=`<li>Name:${element.name} TOTAL Expenses:${element.total_Expense}</li>`
            });
            document.getElementById('expenseboard').appendChild(li);
            document.getElementById('LeaderBoard').appendChild( document.getElementById('expenseboard'));

            leaderboardShown = true;// Set the flag to true after showing the leaderboard

        } catch (error) {
            console.log(error);
        }
    }
}

}


