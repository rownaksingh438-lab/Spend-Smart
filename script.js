// Load saved data
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let bills = JSON.parse(localStorage.getItem("bills")) || [];
let customCards = JSON.parse(localStorage.getItem("customCards")) || [];

// Change Pages

function showPage(pageName) {

    let pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    updateDashboard();
    updateInsights();
}


// Add Custom Card

function addCard() {

    let name = document.getElementById("cardName").value;
    let limit = document.getElementById("cardLimit").value;
    let reward = document.getElementById("cardReward").value;

    if (name === "" || limit === "" || reward === "") {
        alert("Please fill all card details");
        return;
    }

    let card = {
        name: name,
        limit: limit,
        reward: reward
    };

    customCards.push(card);

    localStorage.setItem("customCards", JSON.stringify(customCards));

    document.getElementById("cardName").value = "";
    document.getElementById("cardLimit").value = "";
    document.getElementById("cardReward").value = "";

    displayCards();
}


// Display Custom Cards

function displayCards() {

    let output = "";

    customCards.forEach(function(card, index) {

        output += `
            <div class="box">
                <h3>${card.name}</h3>
                <p>Credit Limit: ₹${Number(card.limit).toLocaleString("en-IN")}</p>
                <p>Reward: ${card.reward}</p>
                <button class="delete-btn" onclick="deleteCard(${index})">
                    Delete
                </button>
            </div>
        `;
    });

    document.getElementById("customCards").innerHTML = output;

    document.getElementById("totalCards").innerText =
        6 + customCards.length;
}


// Delete Custom Card

function deleteCard(index) {

    customCards.splice(index, 1);

    localStorage.setItem("customCards", JSON.stringify(customCards));

    displayCards();
}


// Add Expense

function addExpense() {

    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);
    let category = document.getElementById("expenseCategory").value;
    let payment = document.getElementById("paymentMethod").value;
    let date = document.getElementById("expenseDate").value;

    if (name === "" || amount <= 0 || date === "") {
        alert("Please enter valid expense details");
        return;
    }

    let expense = {
        name: name,
        amount: amount,
        category: category,
        payment: payment,
        date: date
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDate").value = "";

    displayExpenses();
    updateDashboard();
    updateInsights();
}


// Display Expenses

function displayExpenses() {

    let output = "";

    expenses.forEach(function(expense, index) {

        output += `
            <tr>
                <td>${expense.name}</td>
                <td>₹${expense.amount.toLocaleString("en-IN")}</td>
                <td>${expense.category}</td>
                <td>${expense.payment}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="delete-btn"
                    onclick="deleteExpense(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("expenseList").innerHTML = output;
}


// Delete Expense

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
    updateDashboard();
    updateInsights();
}


// Add Bill

function addBill() {

    let name = document.getElementById("billName").value;
    let amount = Number(document.getElementById("billAmount").value);
    let minimum = Number(document.getElementById("minimumAmount").value);
    let date = document.getElementById("billDate").value;

    if (name === "" || amount <= 0 || minimum < 0 || date === "") {
        alert("Please enter valid bill details");
        return;
    }

    if (minimum > amount) {
        alert("Minimum payable cannot be greater than total amount");
        return;
    }

    let bill = {
        name: name,
        amount: amount,
        minimum: minimum,
        date: date,
        status: "Pending"
    };

    bills.push(bill);

    localStorage.setItem("bills", JSON.stringify(bills));

    document.getElementById("billName").value = "";
    document.getElementById("billAmount").value = "";
    document.getElementById("minimumAmount").value = "";
    document.getElementById("billDate").value = "";

    displayBills();
    updateDashboard();
}


// Display Bills

function displayBills() {

    let output = "";

    bills.forEach(function(bill, index) {

        let statusClass = bill.status === "Paid" ? "paid" : "pending";

        output += `
            <tr>
                <td>${bill.name}</td>
                <td>₹${bill.amount.toLocaleString("en-IN")}</td>
                <td>₹${bill.minimum.toLocaleString("en-IN")}</td>
                <td>${bill.date}</td>
                <td class="${statusClass}">${bill.status}</td>
                <td>
                    <button onclick="changeBillStatus(${index})">
                        ${bill.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                    </button>

                    <button class="delete-btn"
                    onclick="deleteBill(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("billList").innerHTML = output;
}


// Change Bill Status

function changeBillStatus(index) {

    if (bills[index].status === "Pending") {
        bills[index].status = "Paid";
    } else {
        bills[index].status = "Pending";
    }

    localStorage.setItem("bills", JSON.stringify(bills));

    displayBills();
    updateDashboard();
}


// Delete Bill

function deleteBill(index) {

    bills.splice(index, 1);

    localStorage.setItem("bills", JSON.stringify(bills));

    displayBills();
    updateDashboard();
}


// Update Dashboard

function updateDashboard() {

    let total = 0;

    expenses.forEach(function(expense) {
        total += expense.amount;
    });

    document.getElementById("totalExpenses").innerText =
        "₹" + total.toLocaleString("en-IN");

    document.getElementById("pendingBills").innerText =
        bills.filter(function(bill) {
            return bill.status === "Pending";
        }).length;

    document.getElementById("totalCards").innerText =
        6 + customCards.length;
}


// Update Spending Insights

function updateInsights() {

    let food = 0;
    let shopping = 0;
    let travel = 0;
    let other = 0;

    expenses.forEach(function(expense) {

        if (expense.category === "Food") {
            food += expense.amount;
        }

        else if (expense.category === "Shopping") {
            shopping += expense.amount;
        }

        else if (expense.category === "Travel") {
            travel += expense.amount;
        }

        else {
            other += expense.amount;
        }
    });

    document.getElementById("foodTotal").innerText =
        "₹" + food.toLocaleString("en-IN");

    document.getElementById("shoppingTotal").innerText =
        "₹" + shopping.toLocaleString("en-IN");

    document.getElementById("travelTotal").innerText =
        "₹" + travel.toLocaleString("en-IN");

    document.getElementById("otherTotal").innerText =
        "₹" + other.toLocaleString("en-IN");
}


// Load Everything When Website Opens

function loadWebsite() {

    displayCards();
    displayExpenses();
    displayBills();
    updateDashboard();
    updateInsights();
}

loadWebsite();