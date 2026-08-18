let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

let form = document.getElementById("form");
let list = document.getElementById("list");

function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function showExpenses() {

    list.innerHTML = "";

    let search = document.getElementById("search")
        .value.toLowerCase();

    let filter = document.getElementById("filter").value;
    let month = document.getElementById("month").value;

    let found = 0;

    expenses.forEach(function(expense) {

        let text = (
            expense.name + " " + expense.category
        ).toLowerCase();

        if (!text.includes(search)) return;
        if (filter != "All" && expense.category != filter) return;
        if (month && !expense.date.startsWith(month)) return;

        list.innerHTML += `
            <tr>
                <td>${expense.name}</td>
                <td>${expense.amount} Birr</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="delete"
                    onclick="deleteExpense(${expense.id})">
                    Delete
                    </button>
                </td>
            </tr>
        `;

        found++;
    });

    document.getElementById("empty").style.display =
        found ? "none" : "block";

    updateTotal();
}

form.addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let error = document.getElementById("error");

    if (!name) {
        error.textContent = "Please enter expense name.";
        return;
    }

    if (amount <= 0 || isNaN(amount)) {
        error.textContent = "Please enter a valid amount.";
        return;
    }

    if (!category || !date) {
        error.textContent = "Please complete all fields.";
        return;
    }

    expenses.push({
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    });

    save();
    form.reset();
    error.textContent = "";
    showExpenses();
});

function deleteExpense(id) {

    if (!confirm("Are you sure you want to delete this expense?"))
        return;

    expenses = expenses.filter(e => e.id != id);

    save();
    showExpenses();
}

function updateTotal() {

    let total = 0;

    expenses.forEach(e => total += e.amount);

    let highest = expenses.length
        ? Math.max(...expenses.map(e => e.amount)) : 0;

    let lowest = expenses.length
        ? Math.min(...expenses.map(e => e.amount)) : 0;

    let average = expenses.length
        ? total / expenses.length : 0;

    document.getElementById("total").textContent =
        total.toFixed(2) + " Birr";

    document.getElementById("count").textContent =
        expenses.length;

    document.getElementById("highest").textContent =
        highest.toFixed(2) + " Birr";

    document.getElementById("lowest").textContent =
        lowest.toFixed(2) + " Birr";

    document.getElementById("average").textContent =
        average.toFixed(2) + " Birr";
}

document.getElementById("search")
    .addEventListener("input", showExpenses);

document.getElementById("filter")
    .addEventListener("change", showExpenses);

document.getElementById("month")
    .addEventListener("change", showExpenses);

document.getElementById("darkBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");

        this.textContent =
            document.body.classList.contains("dark")
            ? "☀️ Light"
            : "🌙 Dark";
    });

showExpenses();