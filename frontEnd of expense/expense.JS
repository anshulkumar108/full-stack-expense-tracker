let submit = document.getElementById('submit');
let data = document.getElementById('expenseList');
let TotalExpense = document.getElementById('Total');
// document.getElementsByClassName('expenseList'), which returns a collection of elements with the class name 'expenseList'. The getElementsByClassName method returns a collection, not a single element.

window.addEventListener('DOMContentLoaded',showExpense);

submit.addEventListener('click', addExpense);

async function addExpense(e) {
   // e.preventDefault();
    console.log(1)
    let amount = document.getElementById('Amount').value;
    let Description = document.getElementById('description').value;
    let Category = document.getElementById('Category').value;

    let expense = {
        amount,
        Description,
        Category
    }
    //console.log(expense);
    localStorage.setItem('Category', JSON.stringify(expense));
   
    try {
        const response = await axios.post('https://crudcrud.com/api/6dc2bdf5c7ed4c26bac8002dcc6e14e8/expenseTracker', expense );
        document.getElementById('Amount').value = "";
    document.getElementById('description').value = "";
    document.getElementById('Category').value = "";
    } catch (error) {
        console.log(error);
    }
    showExpense(amount, Description, Category);
}

async function showExpense(amount, Description, Category) {

    try {
        let response = await axios.get('https://crudcrud.com/api/6dc2bdf5c7ed4c26bac8002dcc6e14e8/expenseTracker')
        let userExpenditure = response.data.usersDetails 
       // console.log(userExpenditure)

        for (let index = 0; index < userExpenditure.length; index++) {
            const li = document.createElement('li')
            li.className = "EXPENSE"

            li.setAttribute('Amount', userExpenditure[index].amount);
            li.setAttribute('Description', userExpenditure[index]. description)
            li.setAttribute('Category', userExpenditure[index]. category)
            li.setAttribute('id', userExpenditure[index].id)
            li.appendChild(document.createTextNode(
                `amount: ${userExpenditure[index].amount},
                Description: ${userExpenditure[index]. description},
                category: ${userExpenditure[index]. category}`
            ))
            // li.innerText = `${amount} ${Description} ${Category}`;

            const delbtn = document.createElement('button')
            delbtn.className = "delete"
            delbtn.textContent = 'DELETE'
            delbtn.addEventListener('click', deleted);

            const editbtn = document.createElement('button')
            editbtn.className = "edit"
            editbtn.textContent = 'EDIT'
            editbtn.addEventListener('click', Edited);

            li.appendChild(delbtn);
            li.appendChild(editbtn);

            data.appendChild(li);

        }


    } catch (error) {
        console.log(error);
    }



}

function Total() {
    const Expense = document.getElementsByClassName('EXPENSE')
    // for(let i=0; i<Expense.length;i++){
    //    // let amount = document.getElementById('Amount').value;
    //     TotalExpense.value=Expense[i].amount;
    // }

    // the innerText of the li element with the template string ${amount} ${Description} ${Category}, but that doesn't create a separate amount property.

    let totalExpense = 0;
    for (let i = 0; i < Expense.length; i++) {
        const expenseText = Expense[i].innerText;
        //console.log(expenseText);//250 movie MovieDELETEEDIT
        const amount = parseFloat(expenseText.split(' ')[0]);
        //console.log(amount);//amount value

        totalExpense += amount;
    }

    TotalExpense.value = totalExpense;
}

async function deleted(e) {
    //console.log(1)
    const deleteElement = e.target.parentElement
    console.log(deleteElement.id)
    const id=deleteElement.getAttribute('id');
    try {
        await axios.delete(`https://crudcrud.com/api/6dc2bdf5c7ed4c26bac8002dcc6e14e8/expenseTracker/${id})`);
        console.log("Deleted");
      } catch (error) {
        console.log(error);
      }
    deleteElement.remove();
    Total();
}

function Edited(e) {
    //console.log(2);
    const editElement = e.target.parentNode;
    document.getElementById('Amount').value = editElement
    document.getElementById('description').value = editElement
    document.getElementById('Category').value = editElement
    editElement.remove();
    Total()

}