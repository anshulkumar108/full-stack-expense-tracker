const amount = document.getElementById("Amount");
const description = document.getElementById("Description");
const category = document.getElementById("Category");
const token = localStorage.getItem("accessToken");
const ul = document.querySelector('ul');

let currentPage = 1;
let limit=document.getElementById("pages").value


document.getElementById("pages").addEventListener('change',()=>{
  const newLimit = document.getElementById("pages").value;
  getcurrPage(currentPage,newLimit);
})

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  console.log(base64Url);
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
  // return JSON.parse(window.atob(base64));   ///this one alo work fine
}

window.addEventListener("DOMContentLoaded", async () => {
  getcurrPage(currentPage,limit)
  const token = localStorage.getItem("accessToken");
  const response=await axios.get('http://localhost:5001/api/premiumUser',{
    headers: {
      Authorization: token,
    },
  })
  if (response.data.isPremimum === true) {
    checkAndDisplayPremiumMessage();
    showLeadBoard();
  }
});

function cleanInputText() {
  document.getElementById("Amount").value = "";
  document.getElementById("Description").value = "";
  document.getElementById("Category").value = "";
}

document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const ExpenseDetails = {
    Amount: amount.value,
    Description: description.value,
    Category: category.value,
  };
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      "http://localhost:5001/users/addExpense",
      ExpenseDetails,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    fetchExpenseList(response.data.PostData);
    cleanInputText();
  } catch (error) {
    console.log(error);
  }
});

async function fetchExpenseList(expensedetails) {
  try {
   
    const ul = document.getElementById("listOfExpense");

    const ExpenseId = expensedetails.id;
    ul.innerHTML += `<li id=${ExpenseId}>  ${expensedetails.amount} ${expensedetails.description} ${expensedetails.category} 
              <button onclick='deleteExpense(event,${ExpenseId})'>DELETE EXPENSE</button>
              </li>`;
  } catch (error) {
    console.log(error);
  }
}

async function deleteExpense(event, ExpenseId) {
  let expenseElement = event.target.parentElement;
  try {
    if (ExpenseId === undefined) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await axios.delete(
      `http://localhost:5001/users/deleteExpense/${ExpenseId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 201) {
      // Successful deletion, remove the element from the UI
      expenseElement.remove();
    }
    if (response.status === 401) {
      // Unauthorized, handle as needed
      console.error("Unauthorized request");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

document.getElementById("Premium").addEventListener("click", async (e) => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/purchaseMember",
      { headers: { Authorization: token } }
    );
    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        try {
          const res = await axios.post(
            "http://localhost:5001/api/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );
          alert("You are a Premium User Now");
          localStorage.setItem("isPremium", "true");
          checkAndDisplayPremiumMessage();
          showLeadBoard();
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      try {
        const res = await axios.post(
          "http://localhost:5001/api/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_failed: true,
          },
          { headers: { Authorization: token } }
        );
        alert("Something went wrong");
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function checkAndDisplayPremiumMessage() {
  document.getElementById("Premium").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user";
}

async function showLeadBoard() {
  const leaderBoard = document.createElement("button");
  leaderBoard.id = "board";
  leaderBoard.innerText = "Show LeaderBoard";
  document.getElementById("message").appendChild(leaderBoard);

  let leaderboardShown = false;

  leaderBoard.onclick = async (e) => {
    e.preventDefault();
    if (!leaderboardShown) {
      // Check if the leaderboard is not already shown
      const token = localStorage.getItem("accessToken");
      try {
        const h3 = document.createElement("h3");
        h3.innerText = " Expense leadBoard of all Users";
        document.getElementById("LeaderBoard").appendChild(h3);

        const li = document.createElement("li");

        const response = await axios.get(
          "http://localhost:5001/api/premium/usersLeaderBoard",
          { headers: { Authorization: token } }
        );
        const listOfUsers = response.data;
        listOfUsers.forEach((element) => {
          li.innerHTML += `<li>Name:${element.name} TOTAL Expenses:${element.total_Expense}</li>`;
        });
        document.getElementById("expenseboard").appendChild(li);
        document
          .getElementById("LeaderBoard")
          .appendChild(document.getElementById("expenseboard"));

        leaderboardShown = true; // Set the flag to true after showing the leaderboard
      } catch (error) {
        console.log(error);
      }
    }
  };
}

document.getElementById("downloadexpense").addEventListener('click',async ()=>{
  const response = await axios.get(
    "http://localhost:5001/api/downloadFile/ExpenseDetails",
    { headers: { Authorization: token } }
  );
  try {
    var a = document.createElement("a");
    a.href = response.data.url;
    a.download = "EXPENSE.txt";
    a.click();
  } catch (error) {
    console.log(error);
  }
})
  

async function getcurrPage(currentPage,limit) {
  try {
    const response = await axios.get(
      `http://localhost:5001/expense/pagination?page=${currentPage}&limit=${limit}`,
      { headers: { Authorization: token } }
    );
    const ul = document.getElementById("listOfExpense");
    ul.innerText = "";

   response.data.result.rows.forEach((expensedetails) => {
    const ExpenseId = expensedetails.id;
    const li = document.createElement("li");
    li.id = ExpenseId;
    li.innerHTML = `${expensedetails.amount} ${expensedetails.description} ${expensedetails.category} 
      <button onclick='deleteExpense(event,${ExpenseId})'>DELETE EXPENSE</button>`;
    ul.appendChild(li);
    });
  
    elem(response.data.totalPages, response.data.page)

  } catch (error) {
    console.log(error);
  }
}

 function elem(allPages, page) {
  console.log(allPages+ "is all apge")
  let li = '';
  let beforePages = parseInt(page)- 1;

  let afterPages = parseInt(page) + 1;
 
  let liActive;

  if (parseInt(page)> 1) {
    // li += `<button class="btn" onclick="getcurrPage(${page - 1}, ${limit})"><i class="fas fa-angle-left"></i></button>`;
    li += `<button class="btn" onclick="getcurrPage(${parseInt(page) - 1}, ${limit})">PREVIOUS</button>`;
  }

  for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > parseInt(allPages)) {
      continue;
    }
    if (pageLength == 0) {
      pageLength = pageLength + 1;
    }

    if (parseInt(page) == pageLength) {
      liActive = 'active';
    } else {
      liActive = '';
    }

    li += `<button class="numb ${liActive}" onclick="getcurrPage(${pageLength}, ${limit})"><span>${pageLength}</span></button>`;
  }

  if (parseInt(page) < parseInt(allPages)) {
    // li += `<button class="btn" onclick="getcurrPage(${page + 1}, ${limit})"><i class="fas fa-angle-right"></i></button>`;
    li += `<button class="btn" onclick="getcurrPage(${parseInt(page)+1}, ${limit})">NEXT</button>`
  }


  document.getElementById("pagebtn").innerHTML = li;
}
