let balanceEl = document.getElementById('balance');
let incomeAmountEl = document.getElementById('income-amount');
let expenseAmountEl = document.getElementById('expense-amount');
let transactionListEL = document.getElementById('transaction-list');
let transactionFormEl = document.getElementById('transaction-form');
let descriptionEl = document.getElementById('description');
let amountEl = document.getElementById('amount');


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];


transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    let description = descriptionEl.value.trim();
    // let amount = Number(amountEl.value);
    let amount = parseFloat(amountEl.value);

    let today = new Date();
    let formattedDate = today.toLocaleDateString();

    transactions.push({
        id: Date.now(),
        description,
        amount,
        date: formattedDate
    })
    console.log(transactions);
    localStorage.setItem('transactions', JSON.stringify(transactions));


    updateTransactionList();
    updateSummary();
    transactionFormEl.reset();
}

function updateTransactionList() {
    console.log("Updating list...");
    transactionListEL.innerHTML = "";

    let sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        let transactionEl = createTransactionElement(transaction)
        transactionListEL.appendChild(transactionEl);
    })
}

function createTransactionElement(transaction) {
    let li = document.createElement('li');
    li.classList.add('transaction');
    li.classList.add(transaction.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
    <div>
    <span>${transaction.description}</span>
    <small>${transaction.date}</small>
    </div>
        <span>
            ${formatCurrency(transaction.amount)}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `;
    return li;
}


function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

function updateSummary() {
    let balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    let income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    let expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);


    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(Math.abs(expenses));
}

function formatCurrency(number) {
    return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
        currencyDisplay: 'code',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
}

updateTransactionList();
updateSummary();