let submit = document.getElementById('submit');
let ul = document.getElementById("expenseList");

let TotalExpense = document.getElementById('Total');


submit.addEventListener('click', addExpense);

window.addEventListener('DOMContentLoaded', () => {
    let storedExpense = localStorage.getItem('Category');
    if (storedExpense) {
        let expense = JSON.parse(storedExpense);
        showExpense(expense.amount, expense.Description, expense.Category);
    }
})


function addExpense(e) {
    // e.preventDefault();
    console.log(1)
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
        localStorage.setItem('Category', JSON.stringify(expense));
        UpdateTotal()
        showExpense(amount, Description, Category);
        document.getElementById('Amount').value = "";
        document.getElementById('description').value = "";
        document.getElementById('Category').value = "";
    }
}

function showExpense(amount, Description, Category) {
    // console.log(userExpenditure)
    var li = document.createElement("li");

    li.innerHTML = `Amount: <span class="editable" contenteditable="true">${amount}</span>,
    Description: <span class="editable" contenteditable="true">${Description}</span>,
    Category: <span class="editable" contenteditable="true">${Category}</span>
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
}

function Edit(e) {

    var expenseElement = e.target.parentElement;
    // console.log(expenseElement);
    var amount = expenseElement.getElementsByClassName("editable")[0].textContent;
    var description = expenseElement.getElementsByClassName("editable")[1].textContent;
    var category = expenseElement.getElementsByClassName("editable")[2].textContent;
    document.getElementById('Amount').value = amount;
    document.getElementById('description').value = description;
    document.getElementById('Category').value = category;

    expenseElement.remove();
    UpdateTotal()

}


function Delete(e) {
    let element = e.target.parentElement
    //console.log(element);
    element.remove();
    UpdateTotal()
    localStorage.removeItem('Category');
}

function UpdateTotal() {
    let totalExpense = 0;
    let expenseItem = ul.getElementsByTagName("li");
    //console.log(expenseItem);
    try {
        for (let i = 0; i < expenseItem.length; i++) {

            let amountElement = expenseItem[i].querySelector(".editable:first-child")
            let amount = parseFloat(amountElement.textContent)

            console.log(2)
            totalExpense += amount;
        };
        TotalExpense.value = totalExpense;
    } catch (error) {
        console.log(error)
    }

}

// function Total() {
//     const Expense = document.getElementsByClassName('EXPENSE')
//     // for(let i=0; i<Expense.length;i++){
//     //    // let amount = document.getElementById('Amount').value;
//     //     TotalExpense.value=Expense[i].amount;
//     // }

//     // the innerText of the li element with the template string ${amount} ${Description} ${Category}, but that doesn't create a separate amount property.

//     let totalExpense = 0;
//     for (let i = 0; i < Expense.length; i++) {
//         const expenseText = Expense[i].innerText;
//         //console.log(expenseText);//250 movie MovieDELETEEDIT
//         const amount = parseFloat(expenseText.split(' ')[0]);
//         //console.log(amount);//amount value

//         totalExpense += amount;
//     }

//     TotalExpense.value = totalExpense;
// }