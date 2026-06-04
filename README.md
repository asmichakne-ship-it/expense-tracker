# 💸 SpendWise — Expense Tracker

A simple full-stack expense tracker built with **Java (Spring Boot)** + **HTML/CSS/JavaScript**.

## Features
- ➕ Add expenses (title, amount, category, date, note)
- ✏️ Edit/modify existing expenses
- 🗑️ Delete expenses
- 📊 View totals: Weekly / Monthly / Yearly / All-time
- 🏷️ Filter expenses by category

## Project Structure
```
expense-tracker/
├── pom.xml                          ← Maven build file
├── src/
│   └── main/
│       ├── java/com/expenses/
│       │   ├── ExpenseTrackerApplication.java  ← App entry point
│       │   ├── Expense.java                    ← Data model
│       │   ├── ExpenseService.java             ← Business logic
│       │   └── ExpenseController.java          ← REST API
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── index.html       ← Frontend UI
│               ├── style.css        ← Styles
│               └── app.js           ← Frontend logic
```

## How to Run

### Requirements
- Java 17+
- Maven 3.6+

### Steps
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# 2. Build and run
mvn spring-boot:run

# 3. Open in browser
# Go to: http://localhost:8080
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET    | /api/expenses | Get all expenses |
| POST   | /api/expenses | Add new expense |
| PUT    | /api/expenses/{id} | Update expense |
| DELETE | /api/expenses/{id} | Delete expense |
| GET    | /api/expenses/summary | Get totals |
| GET    | /api/expenses/category/{name} | Filter by category |
