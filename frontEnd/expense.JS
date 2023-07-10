let submit = document.getElementById('submit');
let ul = document.getElementById("expenseList");
let TotalExpense = document.getElementById('Total');

window.addEventListener('DOMContentLoaded', async () => {
   await fetchExpenseList();
})


submit.addEventListener('click', addExpense);

async function fetchExpenseList(){
    const response = await axios.get('https://crudcrud.com/api/e19e8df2e87a47ca9f340e70f4ac9240/expenseList')
    try {
        for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            //console.log(element)
            showExpense(element);
        }
        UpdateTotal();
    } catch (error) {
        console.log(error)
    }
}

async function addExpense(e) {
    e.preventDefault();
    //console.log(1)
    let amount = document.getElementById('Amount').value;
    let Description = document.getElementById('description').value;
    let Category = document.getElementById('Category').value;

    if (amount === "" || Description === "" || Category === "") {
        alert("Please enter all details");
    } else {
        let expense = {
            amount,
            Description,
            Category
        }
        //console.log(expense);

        await axios.post('https://crudcrud.com/api/e19e8df2e87a47ca9f340e70f4ac9240/expenseList', expense);
        try {
            localStorage.setItem('Category', JSON.stringify(expense));
           
            showExpense(expense);
            document.getElementById('Amount').value = "";
            document.getElementById('description').value = "";
            document.getElementById('Category').value = "";
            UpdateTotal();
        } catch (error) {
            console.log(error);
        }

    }
}

async function showExpense(expense) {
    // console.log(userExpenditure)
    try {
        var li = document.createElement("li");
        li.id = expense._id;

        li.innerHTML = `Amount: <span class="editable" contenteditable="true">${expense.amount}</span>,
    Description: <span class="editable" contenteditable="true">${expense.Description}</span>,
    Category: <span class="editable" contenteditable="true">${expense.Category}</span>
    <button class="delete" onclick="Delete(event)">DELETE</button>
    <button class="edit" onclick="Edit(event)">EDIT</button>`;

        ul.appendChild(li);

        // Add event listeners for editing
        let EditableElements = document.getElementsByClassName('editable')
        //console.log(EditableElements);

        for (let i = 0; i < EditableElements.length; i++) {
            EditableElements[i].addEventListener('input', Edit);
            // console.log(EditableElements[i]);
        }

        UpdateTotal()
    } catch (error) {
        console.log(error)
    }

}


async function Edit(e) {
    var expenseElement = e.target.parentElement;
    var expenseId = expenseElement.id;
    // console.log(expenseId );

    //Delete(e)
    await axios.delete(`https://crudcrud.com/api/e19e8df2e87a47ca9f340e70f4ac9240/expenseList/${expenseId}`)
    try {
        expenseElement.remove();
        UpdateTotal()
        localStorage.removeItem('Category');
    } catch (error) {
        console.log(error)
    }

    var Amount = expenseElement.getElementsByClassName("editable")[0].textContent;
    var description = expenseElement.getElementsByClassName("editable")[1].textContent;
    var category = expenseElement.getElementsByClassName("editable")[2].textContent;

    document.getElementById('Amount').value = Amount;
    document.getElementById('description').value = description;
    document.getElementById('Category').value = category;

    let amount = document.getElementById('Amount').value;
    let Description = document.getElementById('description').value;
    let Category = document.getElementById('Category').value;

    let updatedExpense = {
        amount,
        Description,
        Category
    };
     await axios.put(`https://crudcrud.com/api/e19e8df2e87a47ca9f340e70f4ac9240/expenseList/${expenseId}`, updatedExpense)
     try{
        expenseElement.remove();
        showExpense(updatedExpense);
        UpdateTotal();
      }
      catch(error){
        console.log(error);
      };
}


async function Delete(e) {
    let expenseElement = e.target.parentElement;
    let expenseId = expenseElement.id;
    await axios.delete(`https://crudcrud.com/api/e19e8df2e87a47ca9f340e70f4ac9240/expenseList/${expenseId}`)
    try {
        expenseElement.remove();
        UpdateTotal()
        localStorage.removeItem('Category');
    } catch (error) {
        console.log(error)
    }

}

function UpdateTotal() {
    let totalExpense = 0;
    let expenseItem = ul.getElementsByTagName("li");
    //console.log(expenseItem);
    try {
        for (let i = 0; i < expenseItem.length; i++) {
            let amountElement = expenseItem[i].querySelector(".editable:first-child")
            let amount = parseFloat(amountElement.textContent)
            totalExpense += amount;
        };
        TotalExpense.value = totalExpense;
    } catch (error) {
        console.log(error)
    }

}


