const amount = document.getElementById('Amount');
const description = document.getElementById('Description');
const category = document.getElementById('Category');

window.addEventListener('DOMContentLoaded',async ()=>{
    const token=localStorage.getItem('accessToken');
    const response=await axios.get('http://localhost:5000/users/fetchExpenseDetails',{ headers: {"Authorization" : token} })
        const expensedetails=response.data.Details;
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
        const token=localStorage.getItem('accessToken')
        const response = await axios.post(
            'http://localhost:5000/users/addExpense',
            ExpenseDetails,
            {
                headers: {
                  "Authorization": token
                }
              }
          );
          
        // const token=localStorage.setItem('token', response.data.token)
        // console.log(token);
        fetchExpenseList(response.data.PostData)
    } catch (error) {
        console.log(error);
    }

})

async function fetchExpenseList(expensedetails){
    try {
        console.log(expensedetails);
        const ul=document.getElementById('listOfExpense');
            const ExpenseId=expensedetails.id;
              ul.innerHTML +=`<li id=${ExpenseId}>  ${expensedetails.amount} ${expensedetails.description} ${expensedetails.category} 
              <button onclick='deleteExpense(event,${ExpenseId})'>DELETE EXPENSE</button>
              </li>`
    } catch (error) {
        console.log(error)
    }
}


async function deleteExpense(event,ExpenseId){
    let expenseElement = event.target.parentElement;
    console.log( expenseElement);
    try {
        if (ExpenseId === undefined) {
            console.log('Expense ID is missing');
            return;
          }
        
        const response=await axios.delete(`http://localhost:5000/users/deleteExpense/${ExpenseId}`)

        expenseElement.remove();
} catch (error) {
    console.log(error);
}
    
}