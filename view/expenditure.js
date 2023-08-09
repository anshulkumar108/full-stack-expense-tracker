const amount = document.getElementById('Amount');
const description = document.getElementById('Description');
const category = document.getElementById('Category');

window.addEventListener('load',fetchExpenseList);


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
        const response = await axios.post('http://localhost:5000/users/addExpense', ExpenseDetails)
    } catch (error) {
        console.log(error);
    }

})

async function fetchExpenseList(){
    try {
        
        const response=await axios.get('http://localhost:5000/users/fetchExpenseDetails')
        const expensedetails=response.data.Details;
        console.log(expensedetails);
        const ul=document.getElementById('listOfExpense');
        for(let i=0; i<expensedetails.length;i++){
            const ExpenseId=expensedetails[i].id;
              ul.innerHTML +=`<li id=${ExpenseId}>  ${expensedetails[i].amount} ${expensedetails[i].description} ${expensedetails[i].category} 
              <button onclick='deleteExpense(event,${ExpenseId})'>DELETE EXPENSE</button>
              </li>`
        }
       
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