package com.expenses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")  // Allow requests from the frontend
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // GET all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // GET single expense by ID
    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable int id) {
        return expenseService.getExpenseById(id);
    }

    // POST - add new expense
    @PostMapping
    public Expense addExpense(@RequestBody Map<String, String> body) {
        String title    = body.get("title");
        String category = body.get("category");
        double amount   = Double.parseDouble(body.get("amount"));
        LocalDate date  = LocalDate.parse(body.get("date"));
        String note     = body.getOrDefault("note", "");
        return expenseService.addExpense(title, category, amount, date, note);
    }

    // PUT - update/modify expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable int id, @RequestBody Map<String, String> body) {
        String title    = body.get("title");
        String category = body.get("category");
        double amount   = Double.parseDouble(body.get("amount"));
        LocalDate date  = LocalDate.parse(body.get("date"));
        String note     = body.getOrDefault("note", "");
        return expenseService.updateExpense(id, title, category, amount, date, note);
    }

    // DELETE - remove an expense
    @DeleteMapping("/{id}")
    public Map<String, String> deleteExpense(@PathVariable int id) {
        boolean deleted = expenseService.deleteExpense(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", deleted ? "Expense deleted successfully!" : "Expense not found.");
        return response;
    }

    // GET totals summary
    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        Map<String, Double> summary = new HashMap<>();
        summary.put("weekly",  expenseService.getTotalWeekly());
        summary.put("monthly", expenseService.getTotalMonthly());
        summary.put("yearly",  expenseService.getTotalYearly());
        summary.put("total",   expenseService.getTotalAll());
        return summary;
    }

    // GET by category
    @GetMapping("/category/{category}")
    public List<Expense> getByCategory(@PathVariable String category) {
        return expenseService.getByCategory(category);
    }
}
