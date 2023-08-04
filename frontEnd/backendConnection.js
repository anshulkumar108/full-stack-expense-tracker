let ul = document.getElementById("expenseList");
let TotalExpense = document.getElementById('Total');


window.addEventListener('DOMContentLoaded', async() => {
    await fetchExpenseList();
   
  });
  document.getElementById('submit').addEventListener('click', addExpense);


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
        try {
            await axios.post('http://localhost:5000/postusers', expense);
            localStorage.setItem('Category', JSON.stringify(expense));
            showExpense(expense);
            clearInput();
            UpdateTotal();
        } catch (error) {
            console.log(error);
        }

    } 
}

async function fetchExpenseList(){ 
    try {
        const response = await axios.get('http://localhost:5000/getusers')
        console.log(response.data)
        for (let index = 0; index < response.data.usersDetails.length; index++) {
            const element = response.data.usersDetails[index];
            console.log(element)
            showExpense(element);
        }
        UpdateTotal();
    } catch (error) {
        console.log(error)
    }
}

async function showExpense(expense) {
    try {
        var li = document.createElement("li");
        li.id = expense.id;
    //     li.innerHTML = `Amount: <span class="editable" contenteditable="true">${expense.amount}</span>,
    // Description: <span class="editable" contenteditable="true">${expense.description}</span>,
    // Category: <span class="editable" contenteditable="true">${expense.category}</span>
    // <button class="delete" onclick="Delete(event)">DELETE</button>
    // <button class="edit" onclick="Edit(event)">EDIT</button>`;
    

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
    try {
        await axios.delete(`http://localhost:5000/${expenseId}`);
        expenseElement.remove();
        UpdateTotal();
      } catch (error) {
        console.log(error);
      }

    var Amount = expenseElement.getElementsByClassName("editable")[0].textContent;
    var description = expenseElement.getElementsByClassName("editable")[1].textContent;
    var category = expenseElement.getElementsByClassName("editable")[2].textContent;

    document.getElementById('Amount').value = Amount;
    document.getElementById('description').value = description;
    document.getElementById('Category').value = category;

   
    let updatedExpense = {
        amount:document.getElementById('Amount').value,
        Description:document.getElementById('description').value,
        Category:document.getElementById('Category').value
    
    };
     console.log("2 "+ updatedExpense);
     try{
        await axios.put(`http://localhost:5000/${expenseId}`, updatedExpense)
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
    console.log(expenseId);
    
    if (expenseId === undefined) {
      console.log('Expense ID is missing');
      return;
    }
  
    try {
        //http://localhost:5000/:${expenseId} never use link with :
      await axios.delete(`http://localhost:5000/${expenseId}`);
      expenseElement.remove();
      UpdateTotal();
      localStorage.removeItem('Category');
    } catch (error) {
      console.log(error);
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

function clearInput(){
    document.getElementById('Amount').value = "";
    document.getElementById('description').value = "";
    document.getElementById('Category').value = "";
}

