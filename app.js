// Base URL for the Java backend API
const API_URL = "http://localhost:8080/api/expenses";

// Set today's date as default in the date input
document.getElementById("date").valueAsDate = new Date();

// ==================== LOAD ALL DATA ====================
async function loadAll() {
  await loadExpenses();
  await loadSummary();
}

// ==================== LOAD EXPENSES ====================
async function loadExpenses() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error("Failed to load expenses:", err);
  }
}

// ==================== LOAD SUMMARY ====================
async function loadSummary() {
  try {
    const res = await fetch(`${API_URL}/summary`);
    const data = await res.json();
    document.getElementById("weekly").textContent  = "₹" + data.weekly.toFixed(2);
    document.getElementById("monthly").textContent = "₹" + data.monthly.toFixed(2);
    document.getElementById("yearly").textContent  = "₹" + data.yearly.toFixed(2);
    document.getElementById("total").textContent   = "₹" + data.total.toFixed(2);
  } catch (err) {
    console.error("Failed to load summary:", err);
  }
}

// ==================== RENDER TABLE ====================
function renderTable(expenses) {
  const tbody = document.getElementById("expenseTableBody");
  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">No expenses yet. Add one above! 👆</td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(e => `
    <tr>
      <td>${e.id}</td>
      <td>${e.title}</td>
      <td><span class="category-badge">${e.category}</span></td>
      <td>₹${parseFloat(e.amount).toFixed(2)}</td>
      <td>${e.date}</td>
      <td>${e.note || "-"}</td>
      <td>
        <button class="action-btn edit" onclick="editExpense(${e.id})">✏ Edit</button>
        <button class="action-btn del"  onclick="deleteExpense(${e.id})">🗑 Delete</button>
      </td>
    </tr>
  `).join("");
}

// ==================== ADD or UPDATE EXPENSE ====================
async function submitExpense() {
  const editId   = document.getElementById("editId").value;
  const title    = document.getElementById("title").value.trim();
  const amount   = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date     = document.getElementById("date").value;
  const note     = document.getElementById("note").value.trim();

  // Basic validation
  if (!title || !amount || !date) {
    showToast("⚠️ Please fill in Title, Amount, and Date.");
    return;
  }

  const payload = { title, amount, category, date, note };

  try {
    let res;
    if (editId) {
      // UPDATE existing expense
      res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("✅ Expense updated!");
    } else {
      // ADD new expense
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("✅ Expense added!");
    }

    clearForm();
    loadAll();
  } catch (err) {
    showToast("❌ Something went wrong. Is the server running?");
    console.error(err);
  }
}

// ==================== EDIT (pre-fill form) ====================
async function editExpense(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const e = await res.json();

    document.getElementById("editId").value    = e.id;
    document.getElementById("title").value     = e.title;
    document.getElementById("amount").value    = e.amount;
    document.getElementById("category").value  = e.category;
    document.getElementById("date").value      = e.date;
    document.getElementById("note").value      = e.note || "";

    document.getElementById("form-heading").textContent = "✏️ Edit Expense";
    document.getElementById("btn-label").textContent    = "💾 Save Changes";
    document.getElementById("cancelBtn").style.display  = "inline-block";

    // Scroll to form
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error("Failed to load expense for edit:", err);
  }
}

// ==================== CANCEL EDIT ====================
function cancelEdit() {
  clearForm();
}

// ==================== DELETE EXPENSE ====================
async function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    showToast("🗑 Expense deleted.");
    loadAll();
  } catch (err) {
    showToast("❌ Failed to delete.");
    console.error(err);
  }
}

// ==================== FILTER BY CATEGORY ====================
async function filterExpenses() {
  const category = document.getElementById("filterCategory").value;

  try {
    let url = API_URL;
    if (category !== "all") {
      url = `${API_URL}/category/${category}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error("Filter failed:", err);
  }
}

// ==================== CLEAR FORM ====================
function clearForm() {
  document.getElementById("editId").value   = "";
  document.getElementById("title").value    = "";
  document.getElementById("amount").value   = "";
  document.getElementById("note").value     = "";
  document.getElementById("date").valueAsDate = new Date();
  document.getElementById("category").value = "Food";

  document.getElementById("form-heading").textContent = "Add New Expense";
  document.getElementById("btn-label").textContent    = "➕ Add Expense";
  document.getElementById("cancelBtn").style.display  = "none";
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2800);
}

// ==================== INITIAL LOAD ====================
loadAll();
