const amount = document.getElementById('Amount');
const description = document.getElementById('Description');
const category = document.getElementById('Category');

window.addEventListener('DOMContentLoaded', async () => {
    await fetchExpenseList();

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
        const response = await axios.post('http://localhost:5000/users/addExpense', ExpenseDetails)
    } catch (error) {
        console.log(error);
    }

})

async function fetchExpenseList(){
    try {
        const response=await axios.get('http://localhost:5000/users/fetchExpenseDetails')
        console.log(response.data)
        const expensedetails=response.data;
        expensedetails.forEach(element => {
            `<li> ${element} </li>`
        });

   
        
    } catch (error) {
        console.log(error)
    }
}