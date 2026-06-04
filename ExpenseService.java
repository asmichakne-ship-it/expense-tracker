package com.expenses;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    // In-memory list to store expenses (no database needed)
    private List<Expense> expenses = new ArrayList<>();
    private int nextId = 1;

    // ---- ADD EXPENSE ----
    public Expense addExpense(String title, String category, double amount, LocalDate date, String note) {
        Expense expense = new Expense(nextId++, title, category, amount, date, note);
        expenses.add(expense);
        return expense;
    }

    // ---- GET ALL EXPENSES ----
    public List<Expense> getAllExpenses() {
        return expenses;
    }

    // ---- GET EXPENSE BY ID ----
    public Expense getExpenseById(int id) {
        for (Expense e : expenses) {
            if (e.getId() == id) return e;
        }
        return null;
    }

    // ---- DELETE EXPENSE ----
    public boolean deleteExpense(int id) {
        return expenses.removeIf(e -> e.getId() == id);
    }

    // ---- MODIFY/UPDATE EXPENSE ----
    public Expense updateExpense(int id, String title, String category, double amount, LocalDate date, String note) {
        Expense expense = getExpenseById(id);
        if (expense != null) {
            expense.setTitle(title);
            expense.setCategory(category);
            expense.setAmount(amount);
            expense.setDate(date);
            expense.setNote(note);
        }
        return expense;
    }

    // ---- TOTAL - ALL TIME ----
    public double getTotalAll() {
        double total = 0;
        for (Expense e : expenses) {
            total += e.getAmount();
        }
        return total;
    }

    // ---- TOTAL - WEEKLY (current week) ----
    public double getTotalWeekly() {
        LocalDate today = LocalDate.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int currentWeek = today.get(weekFields.weekOfWeekBasedYear());
        int currentYear = today.getYear();

        return expenses.stream()
            .filter(e -> {
                int expWeek = e.getDate().get(weekFields.weekOfWeekBasedYear());
                int expYear = e.getDate().getYear();
                return expWeek == currentWeek && expYear == currentYear;
            })
            .mapToDouble(Expense::getAmount)
            .sum();
    }

    // ---- TOTAL - MONTHLY (current month) ----
    public double getTotalMonthly() {
        LocalDate today = LocalDate.now();
        return expenses.stream()
            .filter(e -> e.getDate().getMonth() == today.getMonth()
                      && e.getDate().getYear() == today.getYear())
            .mapToDouble(Expense::getAmount)
            .sum();
    }

    // ---- TOTAL - YEARLY (current year) ----
    public double getTotalYearly() {
        int currentYear = LocalDate.now().getYear();
        return expenses.stream()
            .filter(e -> e.getDate().getYear() == currentYear)
            .mapToDouble(Expense::getAmount)
            .sum();
    }

    // ---- FILTER BY CATEGORY ----
    public List<Expense> getByCategory(String category) {
        return expenses.stream()
            .filter(e -> e.getCategory().equalsIgnoreCase(category))
            .collect(Collectors.toList());
    }
}
