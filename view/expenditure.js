
const amount = document.getElementById('Amount');
const description = document.getElementById('Description');
const category = document.getElementById('Category');

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:5000/users/fetchExpenseDetails', { headers: { "Authorization": token } })
    const expensedetails = response.data.Details;
    expensedetails.forEach(expense => {
        fetchExpenseList(expense);
    });
});


document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(1);

    const ExpenseDetails = {
        Amount: amount.value,
        Description: description.value,
        Category: category.value
    }
    console.log(ExpenseDetails);
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


async function deleteExpense(event,ExpenseId){
    let expenseElement = event.target.parentElement;
    try {
        if (ExpenseId === undefined) {
            console.log('Expense ID is missing');
            return;
          }
        const token = localStorage.getItem('accessToken');
        const response=await axios.delete(`http://localhost:5000/users/deleteExpense/${ExpenseId}`,{
                            headers: {
                                "Authorization": token
                            }
                        });
                        if(response.status==201){
                            expenseElement.remove();
                        }else{
                            alert('you are not authorized user')
                        }
       
} catch (error) {
    console.log(error);
}
    
}

document.getElementById('Premium').addEventListener('click',async(e)=>{
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:5000/api/purchaseMember', { headers: { "Authorization": token } })
    console.log(response.data.order)
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:5000/api/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(options)
         alert('You are a Premium User Now')
         document.getElementById('Premium').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "

     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
  })
});



