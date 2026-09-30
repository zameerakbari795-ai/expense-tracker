const form = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");
const searchInput = document.getElementById("search");

// دریافت اطلاعات قبلی
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

// افزودن تراکنش
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (title === "" || amount <= 0) {
        alert("لطفاً اطلاعات درست وارد کنید.");
        return;
    }

    const transaction = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toLocaleDateString("fa-AF")
    };

    transactions.push(transaction);

    saveData();
    updateUI();

    form.reset();
});

// ذخیره در LocalStorage
function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// محاسبه اطلاعات مالی
function calculateTotals() {

    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    incomeElement.textContent =
        income.toLocaleString() + " افغانی";

    expenseElement.textContent =
        expense.toLocaleString() + " افغانی";

    balanceElement.textContent =
        balance.toLocaleString() + " افغانی";

}

// نمایش تراکنش‌ها
function displayTransactions(list = transactions) {

    transactionList.innerHTML = "";

    if (list.length === 0) {

        transactionList.innerHTML = `
            <div class="empty">
                هیچ تراکنشی موجود نیست.
            </div>
        `;

        return;
    }

    list.forEach(function(transaction) {

        const div = document.createElement("div");

        div.className = "transaction";

        const sign =
            transaction.type === "income" ? "+" : "-";

        const amountClass =
            transaction.type === "income"
                ? "amount-income"
                : "amount-expense";

        div.innerHTML = `

            <div class="transaction-info">

                <h3>${transaction.title}</h3>

                <small>
                    ${transaction.category}
                    |
                    ${transaction.date}
                </small>

            </div>

            <div class="transaction-right">

                <span class="${amountClass}">
                    ${sign}
                    ${transaction.amount.toLocaleString()}
                    افغانی
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    حذف
                </button>

            </div>

        `;

        transactionList.appendChild(div);

    });
}

// حذف تراکنش
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveData();
    updateUI();
}

// جستجو
searchInput.addEventListener("input", function() {

    const searchText =
        searchInput.value.toLowerCase();

    const filtered =
        transactions.filter(function(transaction) {

            return (
                transaction.title
                    .toLowerCase()
                    .includes(searchText)
                ||
                transaction.category
                    .toLowerCase()
                    .includes(searchText)
            );

        });

    displayTransactions(filtered);

});

// بروزرسانی کامل صفحه
function updateUI() {

    calculateTotals();
    displayTransactions();

}

updateUI();